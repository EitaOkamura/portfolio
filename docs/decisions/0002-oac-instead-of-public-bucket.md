# 0002: S3 を公開せず、CloudFront の OAC 経由だけで読ませる

- 状態: 採用
- 日付: 2026-09-21

## 背景

移行前の構成を調べたところ、S3 の静的ウェブサイトホスティングが
パブリックに公開されていて、CloudFront のオリジンがその website
エンドポイントになっていた。

実際に確認した結果:

```
http://etaolab.com.s3-website-ap-northeast-1.amazonaws.com/  ->  200 OK
```

CloudFront 経由で取れる内容と SHA-1 が一致した。つまり公開 URL が二重に存在していた。

## 決めたこと

- オリジンを S3 の **REST エンドポイント**に変更する
- **Origin Access Control (OAC)** を付け、CloudFront が SigV4 で署名する
- バケットポリシーを `Principal: Service: cloudfront.amazonaws.com` かつ
  `AWS:SourceArn` でディストリビューションを限定したものに差し替える
- 静的ウェブサイトホスティングを無効にする
- ブロックパブリックアクセスを 4 項目すべて有効にする

## なぜ

1. **費用**。迂回されたアクセスは CloudFront を通らないため、
   無料枠（1TB/月）で吸収されず、S3 のリクエスト課金とデータ転送課金が直撃する。
   移行前は最大 12.6MB の画像があったので、繰り返し叩かれると実際に金額が出る
2. **HTTPS**。S3 の静的ウェブサイトホスティングのエンドポイントは HTTP 専用で、
   HTTPS が使えない。証明書があっても、平文で読める経路が残っていた
3. **ヘッダを効かせられない**。CloudFront を迂回されると、
   Response Headers Policy で付けたセキュリティヘッダが意味を失う

## 捨てたもの

- **OAI (Origin Access Identity)**: 後継の OAC がある。
  OAI は SSE-KMS に対応しないなどの制約があり、新規に選ぶ理由が無い
- **バケットポリシーで IP を絞る**: CloudFront の IP レンジは変わるし、
  管理する意味が無い

## 副作用

- S3 の website エンドポイントが持っていた**ディレクトリのインデックス解決が無くなる**。
  `/foo/` に対して `/foo/index.html` を返す挙動は REST エンドポイントには無い。
  今回は SPA で全てを `/index.html` に集約するため問題にならないが、
  将来ページを物理ファイルに分けるなら CloudFront Functions が要る
- `DeletionPolicy: Retain` を付けたので、スタックを消してもバケットは残る。
  中身を失わないことを優先した
