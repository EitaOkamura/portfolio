#!/usr/bin/env bash
# 公開中のサイトが、意図した状態になっているかを外から確かめる。
#
#   ./scripts/verify-deploy.sh [ドメイン] [バケット名] [リージョン]
#
# 1つでも落ちたら終了コード 1 を返す。移行後とデプロイ後に流すこと。
set -u

DOMAIN="${1:-etaolab.com}"
BUCKET="${2:-etaolab.com}"
REGION="${3:-ap-northeast-1}"
fail=0

ok()   { printf '  ✅ %s\n' "$1"; }
ng()   { printf '  ❌ %s\n' "$1"; fail=1; }
warn() { printf '  ⚠️  %s\n' "$1"; }

echo "== A: S3 の website エンドポイントを迂回に使えないか =="
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 \
  "http://${BUCKET}.s3-website-${REGION}.amazonaws.com/" 2>/dev/null || echo 000)
case "$code" in
  403|404|000) ok "website エンドポイントは使えない ($code)" ;;
  *)           ng "website エンドポイントがまだ生きている ($code)" ;;
esac

echo "== A': S3 の REST エンドポイントが非公開か =="
# バケット名にドットが含まれると仮想ホスト形式は証明書が合わないため、パス形式で叩く
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 \
  "https://s3.${REGION}.amazonaws.com/${BUCKET}/index.html" 2>/dev/null || echo 000)
[ "$code" = "403" ] && ok "REST エンドポイントは非公開 (403)" || ng "オブジェクトを直接取得できる ($code)"

echo "== A'': バケット一覧が漏れていないか =="
body=$(curl -sS --max-time 10 "https://s3.${REGION}.amazonaws.com/${BUCKET}/?list-type=2&max-keys=1" 2>/dev/null || echo '')
echo "$body" | grep -q 'AccessDenied' && ok "ListBucket は拒否されている" || ng "バケット一覧が読める"

echo "== B: HTTP が HTTPS へリダイレクトされるか =="
code=$(curl -sS -o /dev/null -w '%{http_code}' -I --max-time 10 "http://${DOMAIN}/" 2>/dev/null || echo 000)
case "$code" in
  301|302|307|308) ok "HTTPS へリダイレクトする ($code)" ;;
  *)               ng "リダイレクトされない ($code)" ;;
esac

echo "== C: セキュリティヘッダ =="
headers=$(curl -sSI --max-time 10 "https://${DOMAIN}/" 2>/dev/null || echo '')
for name in strict-transport-security x-content-type-options content-security-policy referrer-policy permissions-policy; do
  echo "$headers" | grep -qi "^${name}:" && ok "$name" || ng "$name が無い"
done
echo "$headers" | grep -qi '^server:' && warn "server ヘッダが残っている（オリジン種別が露出する）" || ok "server ヘッダなし"

echo "== CloudFront を経由しているか =="
echo "$headers" | grep -qi 'cloudfront' && ok "CloudFront 経由" || ng "CloudFront を通っていない"

echo "== SPA のルーティング =="
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "https://${DOMAIN}/works/raspberry-pi" 2>/dev/null || echo 000)
[ "$code" = "200" ] && ok "詳細ページの直リンクが開ける" || ng "直リンクが 200 にならない ($code)"

echo "== 中身が配信されているか =="
curl -sS --max-time 10 "https://${DOMAIN}/" 2>/dev/null | grep -q '<div id="root">' \
  && ok "index.html が返っている" || ng "index.html の中身が想定と違う"

echo
if [ "$fail" = "0" ]; then
  echo "✅ 全部通った"
else
  echo "❌ 落ちた項目がある"
fi
exit "$fail"
