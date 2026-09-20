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
- **AWS の公開設定の修正: 未適用。** 手順は [docs/aws-migration.md](docs/aws-migration.md)。
  適用前なので `./scripts/verify-deploy.sh` は落ちる
- GitHub Actions: ワークフローは書いてあるが、
  OIDC ロールと リポジトリ変数が未設定のため未稼働
