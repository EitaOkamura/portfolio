/**
 * 元サイト（etaolab.com）から取得した画像を WebP に変換して public/images/ へ置く。
 *
 *   node scripts/optimize-images.mjs <取得済み画像のディレクトリ>
 *
 * 元サイトの画像は最大 6623x9362 / 12.6MB あり、そのままでは転送量と
 * 表示速度の両方で問題になる。用途ごとに上限幅を変えて縮小する。
 * 再実行しても結果が変わらないよう、出力は毎回作り直す。
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

/** 上限幅。先に一致したものを使う。設計課題のパネルは拡大して読む前提で大きめに残す。 */
const WIDTH_RULES = [
  [/^images\/Architecture\//, 2400],
  [/^images\/etasportfolio\//, 1600],
  [/Icon\.png$/, 256],
  [/^images\/(books|graduate)\.png$/, 256],
  [/^images\/computer_tokui_boy\.png$/, 640],
]
const DEFAULT_WIDTH = 1400

function maxWidthFor(rel) {
  for (const [pattern, width] of WIDTH_RULES) {
    if (pattern.test(rel)) return width
  }
  return DEFAULT_WIDTH
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield full
  }
}

const srcRoot = process.argv[2]
if (!srcRoot) {
  console.error('使い方: node scripts/optimize-images.mjs <取得済み画像のディレクトリ>')
  process.exit(1)
}
const outRoot = new URL('../public/', import.meta.url).pathname

let totalIn = 0
let totalOut = 0
const report = []

for await (const file of walk(srcRoot)) {
  const rel = relative(srcRoot, file)
  const outRel = rel.replace(/\.(png|jpe?g)$/i, '.webp')
  const outPath = join(outRoot, outRel)
  await mkdir(dirname(outPath), { recursive: true })

  const image = sharp(file)
  const meta = await image.metadata()
  const limit = maxWidthFor(rel)
  const width = meta.width && meta.width > limit ? limit : undefined

  await image
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(outPath)

  const before = (await stat(file)).size
  const after = (await stat(outPath)).size
  totalIn += before
  totalOut += after
  report.push({ from: rel, to: outRel, before, after, width: width ?? meta.width })
}

const mb = (n) => (n / 1048576).toFixed(2)
report.sort((a, b) => b.before - a.before)
for (const r of report.slice(0, 8)) {
  console.log(`  ${r.to.padEnd(40)} ${mb(r.before)}MB -> ${mb(r.after)}MB (w=${r.width})`)
}
console.log(`\n${report.length} 枚  ${mb(totalIn)}MB -> ${mb(totalOut)}MB  (${((1 - totalOut / totalIn) * 100).toFixed(1)}% 削減)`)

/** どの元画像がどこへ行ったかを残す。移行後に元サイトと突き合わせるため。 */
await writeFile(
  new URL('../docs/image-manifest.json', import.meta.url),
  JSON.stringify(report, null, 2) + '\n',
)
