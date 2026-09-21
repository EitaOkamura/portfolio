/** 表示用の書式ヘルパ。純粋関数だけを置く（テストしやすくするため）。 */

import type { Rating, Skill } from './content/types'

/** 星の並びを「塗り」「空」の個数で返す。記号そのものは描画側で決める。 */
export function starParts(rating: Rating): { filled: number; empty: number } {
  const filled = Math.min(5, Math.max(0, Math.round(rating)))
  return { filled, empty: 5 - filled }
}

/** 読み上げ用のラベル。★の羅列は読み上げると意味を成さないため別に用意する。 */
export function ratingLabel(rating: Rating): string {
  return `5段階中 ${rating}`
}

/** 評価軸の配列から、その段階の説明を引く。範囲外は空文字を返して描画側を単純にする。 */
export function scaleText(scale: readonly string[], rating: Rating): string {
  return scale[rating - 1] ?? ''
}

/** 年表の見出し。元サイトの「2008年～」という書き方に揃える。 */
export function formatYear(year: string): string {
  return `${year}年 —`
}

/** URL からサービス名にあたる部分を取り出す。リンクのラベルが無いときの保険。 */
export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** 評価の高い順に並べる。同点なら元の並び順を保つ（安定ソート）。
 *  toSorted は元の配列を変更しないので、コピーを作る必要がない。 */
export function byRatingDesc(skills: readonly Skill[]): Skill[] {
  return skills.toSorted((a, b) => b.rating - a.rating)
}

/** 一覧の見出しに出す「n 件」。0 件のときに「0 件」と出したいのでそのまま返す。 */
export function countLabel(n: number, unit = '件'): string {
  return `${n} ${unit}`
}

/** 見出しから目次アンカーを作る。日本語はそのまま使えないので id は呼び出し側が持つ前提で、
 *  ここでは英数字の見出し用の簡易版だけを用意する。 */
export function anchorId(prefix: string, raw: string): string {
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug ? `${prefix}-${slug}` : prefix
}
