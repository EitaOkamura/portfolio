# portfolio

[etaolab.com](https://etaolab.com/) のポートフォリオサイト。
React + Vite + TypeScript。S3 + CloudFront + Route 53 で配信する。

旧版（HTML / CSS / jQuery の 1 枚もの）からの移植なので、
**文言は本人が書いたものをそのまま引き継いでいる。勝手に言い換えない。**

## 構成

- `src/content/` — **サイトに載せる文言とデータはすべてここ**。型は `types.ts`
- `src/components/` — 並べ方だけを持つ。本文は持たせない
- `src/pages/` — ルートに対応する画面
- `src/format.ts` — 表示用の純粋関数。**テストしやすいものはここへ寄せる**
- `infra/` — CloudFormation テンプレート
- `scripts/` — 画像変換、テンプレート検証、公開状態の検証
- `docs/decisions/` — 設計判断の記録 (ADR)
- `workbench/` — 調査メモ・下書き（git 管理外）

このディレクトリが Git リポジトリのルート。

## コマンド

`make help` に全部ある。

```bash
make check    # lint + 型検査 + テスト + ビルド + infra の構文確認。コミット前にこれを通す
make dev
make test
make infra    # CloudFormation テンプレートの構文確認だけ
```

## 守ること

- **ロジックはコンポーネントから出す。** 純粋関数にすればテストが安く書ける
- **文言を足すときは `src/content/` に足す。** JSX に直接書かない
- `dist/` と `node_modules/` はコミットしない
- `package-lock.json` は**コミットする**
- テストを消したり skip したりして `make check` を通さない
- **`public/images/` は生成物。** 元画像から `make images SRC=...` で作り直せる。
  対応は `docs/image-manifest.json` にある

## AWS まわりで気をつけること

- **S3 バケットを公開しない。** CloudFront の OAC 経由だけで読ませる。
  なぜそうするかは [docs/decisions/0002](docs/decisions/0002-oac-instead-of-public-bucket.md)。
  移行前はここが開いていて、CloudFront を迂回できる状態だった
- **CSP を緩めるときは理由を書く。** 現状 `form-action` と `frame-src` に
  `docs.google.com` が入っているのは、お問い合わせが Google フォームへ POST するため。
  ここを消すとフォームが動かなくなる
- **CloudFront の全消し (`--paths "/*"`) をしない。** 無効化は 1000 パス/月まで無料。
  ファイル名にハッシュが付かないものだけ指定すれば足りる
- 構成を変えたら `./scripts/verify-deploy.sh` を流す。**結果を見ずに完了と言わない**

## 状態（2026-09-21 時点）

- React への移植とデザイン刷新: 完了。`make check` は通っている
- 画像の最適化: 完了（47.4MB → 4.4MB）
- **AWS の公開設定の修正: 適用済み。** `./scripts/verify-deploy.sh` は全項目通過。
  適用した内容は [docs/aws-migration.md](docs/aws-migration.md) の 10 節
- 本番配信: 完了。https://etaolab.com/ は React 版が出ている
- 操作は IAM ユーザー `etaolab-admin`（MFA 強制）で行う。**ルートは使わない**
- **GitHub Actions: 未稼働。** ワークフローは書いてあるが、
  リポジトリが GitHub に無く、OIDC ロールとリポジトリ変数も未設定

## 主要な識別子

| 種別 | 値 |
|---|---|
| S3 バケット | `etaolab.com` (ap-northeast-1) |
| CloudFront | `E3OYIZGQS2R1BB` |
| OAC | `E5S251M5I6TYV` |
| Response Headers Policy | `2469581e-5989-4832-b1de-afc4be27cbe0` |
| AWS プロファイル | `etaolab`（`aws login` で更新。アクセスキーは無い） |

<!-- BEGIN AWS Agent Toolkit rules -->

# AWS Guidance

- Where these AWS rules conflict with the project's own instructions, the
  project's instructions take precedence.
- Prefer the AWS MCP Server for AWS interactions — it provides sandboxed
  execution, observability, and audit logging. If unavailable, use the
  AWS CLI directly.
- Before starting a task, check whether a relevant AWS skill is available.
  Load the skill with `retrieve_skill` and prefer its guidance over
  general knowledge.
- When uncertain about specific AWS details (API parameters, permissions,
  limits, error codes), verify against documentation rather than guessing.
  State uncertainty explicitly if you cannot confirm.
- When creating infrastructure, prefer infrastructure-as-code (AWS CDK or
  CloudFormation) over direct CLI commands.
- When working with infrastructure, follow AWS Well-Architected Framework
  principles.
- Do not use em dashes in AWS resource names or descriptions. Use
  hyphens instead.

## Secret Safety

- MUST load the `aws-secrets-manager` skill first for any secret,
  credential, API key, token, or password task. MUST NOT call
  `secretsmanager get-secret-value` or `batch-get-secret-value`, and MUST
  NOT hit the Secrets Manager Agent daemon directly. MUST use
  `{{resolve:secretsmanager:secret-id:SecretString:json-key}}` with
  `asm-exec` so the secret resolves at runtime without entering context.

<!-- END AWS Agent Toolkit rules -->
