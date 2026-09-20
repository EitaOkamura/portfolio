# AWS 構成の移行手順

現状の公開設定には、**CloudFront を迂回して S3 に直接アクセスできる**という穴がある。
この文書は、それを塞いで HTTPS を強制し、セキュリティヘッダを付けるまでの手順。

**この手順で増える費用はない。** 使うもの（OAC、Response Headers Policy、
Block Public Access、ACM 証明書）はすべて課金対象外で、CloudFront は
1TB/月・1000万リクエスト/月まで無期限で無料。むしろ後述のとおり、
現状のほうが課金リスクを抱えている。

---

## 1. 現状（2026-09-21 時点で実際に確認した内容）

```
Route 53 (etaolab.com)
  └─ A レコード（エイリアス）
       └─ CloudFront
            └─ オリジン: etaolab.com.s3-website-ap-northeast-1.amazonaws.com
                         （S3 の静的ウェブサイトホスティング / パブリック）
```

確認に使ったコマンドと結果:

```bash
# CloudFront は挟まっている
curl -sSI https://etaolab.com/ | grep -i via
#   via: 1.1 ....cloudfront.net (CloudFront)

# しかし S3 の website エンドポイントが直接開ける
curl -sS -o /dev/null -w '%{http_code}\n' \
  http://etaolab.com.s3-website-ap-northeast-1.amazonaws.com/
#   200

# 中身は CloudFront 経由と完全に同じ
diff <(curl -sS https://etaolab.com/) \
     <(curl -sS http://etaolab.com.s3-website-ap-northeast-1.amazonaws.com/)
#   差分なし

# バケット一覧は漏れていない（ここは問題ない）
curl -sS 'https://s3.ap-northeast-1.amazonaws.com/etaolab.com/?list-type=2'
#   <Error><Code>AccessDenied</Code>...

# HTTP がリダイレクトされない
curl -sSI http://etaolab.com/ | head -1
#   HTTP/1.1 200 OK        ← 301/308 であるべき

# セキュリティヘッダが一つも無い
curl -sSI https://etaolab.com/ | grep -icE 'strict-transport|content-security|x-content-type|referrer-policy'
#   0
```

### 問題点

| # | 問題 | 影響 |
|---|---|---|
| A | S3 の website エンドポイントが公開されていて CloudFront を迂回できる | 迂回分は CloudFront 無料枠で吸収されず **S3 のリクエスト課金とデータ転送課金が直撃する**。また website エンドポイントは HTTP 専用で HTTPS が使えない |
| B | HTTP が HTTPS にリダイレクトされない | 平文で閲覧できてしまう。証明書があるのに使われない経路が残る |
| C | セキュリティヘッダが一つも無い | HSTS・MIME スニッフィング防止・CSP のいずれも効いていない |
| D | 画像が未最適化（合計 47MB、最大 12.6MB） | 表示が遅い。転送量も無駄 |

D はこのリポジトリ側で対応済み（4.4MB / 90.6% 削減）。A〜C がこの手順の対象。

---

## 2. 移行後の姿

```
Route 53 (etaolab.com)
  └─ A / AAAA レコード（エイリアス）
       └─ CloudFront
            ├─ Viewer Protocol Policy: Redirect HTTP to HTTPS
            ├─ Response Headers Policy: HSTS / CSP / X-Content-Type-Options ...
            └─ オリジン: etaolab.com.s3.ap-northeast-1.amazonaws.com
                         （S3 REST エンドポイント / 完全非公開）
                    ↑ OAC が SigV4 で署名したリクエストだけ通る
```

`infra/site.yaml` がこの姿を記述している。

---

## 3. やり方は2通りある

### 方法1: 既存の構成をそのまま直す（推奨）

DNS を触らず、ダウンタイムもほぼ無い。バケット名も維持できる。
所要 15〜20 分。**まずこちらを推奨する。**
→ [4. 方法1の手順](#4-方法1の手順)

### 方法2: CloudFormation で作り直して切り替える

構成がコードで管理される状態になるが、
CloudFront の代替ドメイン名（`etaolab.com`）は
**同時に1つのディストリビューションにしか設定できない**ため、
旧から外して新に付け替える数分〜十数分の切り替え時間が生じる。
→ [5. 方法2の手順](#5-方法2の手順)

どちらを選んでも、`infra/site.yaml` は「あるべき姿」の記述として残る。
方法1を選んだ場合、あとから CloudFormation の
[リソースインポート](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import.html)
で既存リソースをスタックに取り込める。

---

## 4. 方法1の手順

> 各ステップのあと、`8. 確認` のコマンドで結果を確かめること。
> **順番を入れ替えないこと。** バケットを先に閉じると、
> オリジンを切り替えるまでサイトが 403 になる。

### 4-1. OAC を作る

CloudFront コンソール → 左メニュー **Origin access** → **Create control setting**

| 項目 | 値 |
|---|---|
| Name | `etaolab-oac` |
| Origin type | S3 |
| Signing behavior | Sign requests (recommended) |

### 4-2. Response Headers Policy を作る

CloudFront コンソール → **Policies** → **Response headers** → **Create response headers policy**

Security headers を以下で設定する:

| 項目 | 値 |
|---|---|
| Strict-Transport-Security | max-age `31536000`、Include subdomains ✅、Preload ❌ |
| X-Content-Type-Options | `nosniff` ✅ |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| X-XSS-Protection | 無効のまま（現代のブラウザでは非推奨。CSP で守る） |

Content-Security-Policy には次を入れる。**この内容から削らないこと** —
Google Fonts とお問い合わせフォーム（Google フォーム）が動かなくなる:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action https://docs.google.com; frame-src https://docs.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```

Custom headers に1つ追加:

| Header | Value |
|---|---|
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |

Remove headers に `server` を追加（オリジンの種類を漏らさない）。

### 4-3. ディストリビューションのオリジンを差し替える

CloudFront → 対象のディストリビューション → **Origins** タブ → 既存のオリジンを **Edit**

| 項目 | 変更前 | 変更後 |
|---|---|---|
| Origin domain | `etaolab.com.s3-website-ap-northeast-1.amazonaws.com` | `etaolab.com.s3.ap-northeast-1.amazonaws.com`（**REST エンドポイント**。一覧から S3 バケットとして選ぶ） |
| Origin access | Public | **Origin access control settings** → 4-1 で作った `etaolab-oac` |

保存すると「バケットポリシーを更新してください」という案内と、
貼り付け用のポリシーが表示される。**この時点ではまだ貼らない**（4-5 で貼る）。

### 4-4. ビヘイビアを直す

**Behaviors** タブ → Default (*) → **Edit**

| 項目 | 変更前 | 変更後 |
|---|---|---|
| Viewer protocol policy | HTTP and HTTPS | **Redirect HTTP to HTTPS** |
| Compress objects automatically | — | Yes |
| Cache policy | — | `CachingOptimized`（マネージド） |
| Response headers policy | なし | 4-2 で作ったもの |

**Error pages** タブで、SPA のルーティング用に2つ追加する
（`/works/raspberry-pi` のような URL を直接開けるようにするため）:

| HTTP error code | Customize error response | Response page path | HTTP Response code | TTL |
|---|---|---|---|---|
| 403 Forbidden | Yes | `/index.html` | 200 | 10 |
| 404 Not Found | Yes | `/index.html` | 200 | 10 |

デプロイ完了まで待つ（Last modified が `Deploying` から日時に変わるまで、数分）。

### 4-5. バケットポリシーを OAC 専用に差し替える

S3 → `etaolab.com` → **アクセス許可** → **バケットポリシー** → 編集

既存の `"Principal": "*"` のポリシーを**丸ごと消して**、以下に置き換える。
`<ACCOUNT_ID>` と `<DISTRIBUTION_ID>` は自分の値に差し替えること。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::etaolab.com/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
        }
      }
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::etaolab.com", "arn:aws:s3:::etaolab.com/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    }
  ]
}
```

### 4-6. 静的ウェブサイトホスティングを無効にする

S3 → `etaolab.com` → **プロパティ** → 一番下の **静的ウェブサイトホスティング** → **編集** → 無効にする

これで `etaolab.com.s3-website-ap-northeast-1.amazonaws.com` が死ぬ。**問題 A の本丸。**

### 4-7. ブロックパブリックアクセスを全部オンにする

S3 → `etaolab.com` → **アクセス許可** → **ブロックパブリックアクセス** → **編集**
→ **パブリックアクセスをすべてブロック** にチェック → 保存

4-5 のポリシーは `Principal: Service` であってパブリックではないので、
これを有効にしても CloudFront からは読める。

### 4-8. 確認する

[8. 確認](#8-確認) へ。

---

## 5. 方法2の手順

バケット名は全世界で一意なので、既存の `etaolab.com` を使い回すなら、
スタックには既存バケットを**インポート**する必要がある。
新規に作る場合は別名（例 `etaolab-site-prod`）にする。

```bash
# 1. 証明書の ARN を調べる（CloudFront 用は us-east-1 にある）
aws acm list-certificates --region us-east-1 \
  --query "CertificateSummaryList[?DomainName=='etaolab.com'].CertificateArn" --output text

# 2. テンプレートを検証する（構文だけでなく CloudFormation として妥当か見る）
aws cloudformation validate-template --template-body file://infra/site.yaml

# 3. 変更セットで、何が起きるかを先に見る
aws cloudformation deploy \
  --template-file infra/site.yaml \
  --stack-name etaolab-site \
  --region ap-northeast-1 \
  --no-execute-changeset \
  --parameter-overrides \
      DomainName=etaolab.com \
      BucketName=etaolab-site-prod \
      CertificateArn=<上で調べた ARN> \
      IncludeWwwAlias=false
```

**注意**: `Aliases` に `etaolab.com` を含めたまま新しいディストリビューションを作ると、
既存のディストリビューションが同じ代替ドメイン名を持っているため
`CNAMEAlreadyExists` で失敗する。手順は:

1. `Aliases` を空にしたテンプレートで新スタックを作る
2. `d1234.cloudfront.net` のような割り当てドメインで中身を確認する
3. 旧ディストリビューションから `etaolab.com` を外す
4. 新ディストリビューションに `etaolab.com` を足す（テンプレートを戻して再適用）
5. Route 53 のエイリアス先を新ディストリビューションに向ける
6. 確認後、旧ディストリビューションを無効化 → 削除

3〜5 の間はサイトが見えない時間が生じる。

---

## 6. 資材を置く

```bash
npm ci
npm run build

aws s3 sync dist/ s3://etaolab.com/ --delete \
  --exclude "assets/*" --cache-control "public, max-age=0, must-revalidate"

aws s3 sync dist/ s3://etaolab.com/ --delete \
  --exclude "*" --include "assets/*" \
  --cache-control "public, max-age=31536000, immutable"

aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> \
  --paths "/" "/index.html" "/favicon.svg"
```

**旧サイトのファイル**（`CSS/`、`JavaScript/`、`*.html`、`images/**/*.png|jpg`）は
`--delete` で消える。消えて困るものが無いか、事前に確認すること:

```bash
aws s3 ls s3://etaolab.com/ --recursive --human-readable --summarize > /tmp/before.txt
```

これを自動化したものが `.github/workflows/deploy.yml`。

---

## 7. GitHub Actions からデプロイできるようにする

アクセスキーは作らない。OIDC で短命トークンを使う。

```bash
aws cloudformation deploy \
  --template-file infra/github-oidc.yaml \
  --stack-name etaolab-github-oidc \
  --region ap-northeast-1 \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
      GitHubOwner=EitaOkamura \
      GitHubRepo=portfolio \
      GitHubBranch=main \
      SiteBucketName=etaolab.com \
      DistributionId=<DISTRIBUTION_ID> \
      CreateOidcProvider=true

# ロールの ARN を取り出す
aws cloudformation describe-stacks --stack-name etaolab-github-oidc \
  --region ap-northeast-1 \
  --query "Stacks[0].Outputs[?OutputKey=='DeployRoleArn'].OutputValue" --output text
```

> アカウントに GitHub の OIDC プロバイダが既にある場合は
> `CreateOidcProvider=false` にする（1アカウントに1つしか作れない）。

GitHub のリポジトリ → Settings → Secrets and variables → Actions → **Variables** に登録:

| 名前 | 値 |
|---|---|
| `AWS_ROLE_ARN` | 上で取り出した ARN |
| `AWS_REGION` | `ap-northeast-1` |
| `S3_BUCKET` | `etaolab.com` |
| `CLOUDFRONT_DIST_ID` | ディストリビューション ID |

いずれも秘密ではないので Secrets ではなく Variables でよい。

---

## 8. 確認

移行後、**必ずこれを流す**。1つでも落ちたら直すまで終わりにしない。

```bash
#!/usr/bin/env bash
set -u
fail=0

echo "== A: S3 の website エンドポイントが死んでいるか =="
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 \
  http://etaolab.com.s3-website-ap-northeast-1.amazonaws.com/ || echo 000)
echo "  -> $code"
case "$code" in 403|404|000) echo "  ✅ 迂回できない";; *) echo "  ❌ まだ直接読める"; fail=1;; esac

echo "== A': S3 の REST エンドポイントが死んでいるか =="
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 \
  https://s3.ap-northeast-1.amazonaws.com/etaolab.com/index.html)
echo "  -> $code"
[ "$code" = "403" ] && echo "  ✅ 非公開" || { echo "  ❌ まだ直接読める"; fail=1; }

echo "== B: HTTP が HTTPS へ飛ぶか =="
code=$(curl -sS -o /dev/null -w '%{http_code}' -I http://etaolab.com/)
echo "  -> $code"
case "$code" in 301|302|307|308) echo "  ✅ リダイレクトする";; *) echo "  ❌ 飛んでいない"; fail=1;; esac

echo "== C: セキュリティヘッダ =="
h=$(curl -sSI https://etaolab.com/)
for name in strict-transport-security x-content-type-options content-security-policy referrer-policy permissions-policy; do
  echo "$h" | grep -qi "^$name:" && echo "  ✅ $name" || { echo "  ❌ $name が無い"; fail=1; }
done
echo "$h" | grep -qi '^server:' && { echo "  ⚠️  server ヘッダが残っている"; } || echo "  ✅ server ヘッダなし"

echo "== SPA のルーティング =="
code=$(curl -sS -o /dev/null -w '%{http_code}' https://etaolab.com/works/raspberry-pi)
echo "  /works/raspberry-pi -> $code"
[ "$code" = "200" ] || { echo "  ❌ 直リンクが開けない"; fail=1; }

echo "== サイトが普通に見えるか =="
curl -sS https://etaolab.com/ | grep -q '<div id="root">' \
  && echo "  ✅ index.html が返っている" || { echo "  ❌ 中身が違う"; fail=1; }

echo
[ "$fail" = "0" ] && echo "✅ 全部通った" || { echo "❌ 落ちた項目がある"; exit 1; }
```

このスクリプトは `scripts/verify-deploy.sh` に置いてある。

---

## 9. 残っている検討事項

- **`www.etaolab.com` が引けない。** 使う予定があるなら、ACM 証明書に
  `www.etaolab.com` を追加し、CloudFront の代替ドメイン名と Route 53 に足す。
  使わないなら現状のままでよい（余計な証明書を持たないほうが管理が楽）。
- **HSTS の preload は入れていない。** 一度プリロードリストに載ると
  取り消しに時間がかかるため、運用が安定してから判断する。
- **アクセスログは取っていない。** CloudFront の標準ログは S3 への保管料がかかる。
  必要になってからで遅くない。
