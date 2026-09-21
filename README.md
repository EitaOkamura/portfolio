# portfolio

[etaolab.com](https://etaolab.com/) — Eita Okamura のポートフォリオサイト。

HTML / CSS / jQuery で書かれていた 1 枚もののランディングページを、
React + TypeScript + Vite で作り直したもの。AWS の S3 / CloudFront / Route 53 で配信する。

このディレクトリが Git リポジトリのルート。

## 動かす

```bash
npm ci
make dev      # http://localhost:5173
```

```bash
make check    # lint + 型検査 + テスト + ビルド + infra の構文確認
make help     # 全部のコマンド
```

## 構成

```
src/
  content/      サイトに載せる文言とデータ（型付き）。本文を直すときはここ
  components/   並べ方だけを持つ。文言は持たない
  pages/        ルートに対応する画面
  format.ts     表示用の純粋関数。テストはここに集める
infra/
  site.yaml           S3 + CloudFront + OAC + セキュリティヘッダ
  github-oidc.yaml    GitHub Actions からデプロイするための IAM ロール
scripts/
  optimize-images.mjs 元サイトの画像を WebP へ変換する
  validate-infra.mjs  CloudFormation テンプレートの構文確認
  verify-deploy.sh    公開中のサイトの状態を外から検証する
docs/
  aws-migration.md    AWS の公開設定を直す手順
  decisions/          設計判断の記録 (ADR)
```

**文言を直したいときは `src/content/` を見る。** コンポーネントには本文が無い。

## デプロイ

`main` に push すると `.github/workflows/deploy.yml` が
ビルド → S3 へ同期 → CloudFront のキャッシュ削除 → 公開状態の検証 まで行う。

認証はアクセスキーではなく **OIDC**。長期の鍵はどこにも置かない。
初回に必要な設定は [docs/aws-migration.md](docs/aws-migration.md) の 7 節。

手で確認したいとき:

```bash
./scripts/verify-deploy.sh
```

## AWS の公開設定について

移行前の構成には、**CloudFront を迂回して S3 に直接アクセスできる**という問題があった。
迂回されたアクセスは CloudFront の無料枠で吸収されず S3 の課金対象になる。
経緯と直し方は [docs/aws-migration.md](docs/aws-migration.md) にまとめてある。

## お問い合わせ

`/api/contact` への POST を CloudFront が API Gateway へ流し、Lambda が SES で
メールを送る。同一オリジンなので CORS は要らず、CSP も `connect-src 'self'` のまま。

構成は [infra/contact.yaml](infra/contact.yaml)、経緯は
[docs/aws-migration.md](docs/aws-migration.md) の 12 節。

## 画像

元サイトの画像は合計 47MB（最大 12.6MB / 6623×9362px）あった。
`public/images/` に入っているのは、それを WebP へ変換した 4.4MB 版。

取得済みの元画像から作り直すとき:

```bash
make images SRC=<元画像のディレクトリ>
```

どの元画像がどこへ行ったかは `docs/image-manifest.json` に残る。
