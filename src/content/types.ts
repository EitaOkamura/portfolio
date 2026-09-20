/** サイトに載せる内容の型。文言はすべて content/ 配下のデータに寄せ、
 *  コンポーネントは「並べ方」だけを持つ。 */

/** 5段階のスキル評価。評価軸は SkillDomain.scale に書く。 */
export type Rating = 1 | 2 | 3 | 4 | 5

export type Skill = {
  name: string
  rating: Rating
}

export type SkillGroup = {
  id: string
  title: string
  description: string
  skills: Skill[]
}

/** IT / 建築 / その他 のような大きな括り。評価軸は括りごとに意味が違う。 */
export type SkillDomain = {
  id: string
  title: string
  lead: string
  /** scale[0] が★1つ、scale[4] が★5つの意味。 */
  scale: [string, string, string, string, string]
  groups: SkillGroup[]
  /** 評価を付けずに「学習中」とだけ示すもの。 */
  learning?: { title: string; description: string; items: string[] }
}

export type QA = {
  question: string
  answer: string[]
}

export type HistoryEntry = {
  year: string
  title: string
  body: string
}

export type WorkLink = {
  label: string
  href: string
}

export type Work = {
  id: string
  index: string
  title: string
  summary: string
  /** 詳細ページを持つものだけ。持たないものは概要だけ表示する。 */
  detailPath?: string
  stack?: string[]
  note?: string
}

export type BookShelf = {
  id: string
  title: string
  it: string[]
  architecture: string[]
}

export type Figure = {
  src: string
  alt: string
}

export type DetailSection = {
  id: string
  title: string
  blocks: { heading: string; body: string[]; figures?: Figure[] }[]
}
