import { describe, expect, it } from 'vitest'
import {
  anchorId,
  byRatingDesc,
  countLabel,
  formatYear,
  hostname,
  ratingLabel,
  scaleText,
  starParts,
} from './format'
import type { Skill } from './content/types'

describe('starParts', () => {
  it('塗りと空で必ず5つになる', () => {
    for (const r of [1, 2, 3, 4, 5] as const) {
      const { filled, empty } = starParts(r)
      expect(filled + empty).toBe(5)
      expect(filled).toBe(r)
    }
  })
})

describe('ratingLabel', () => {
  it('読み上げ用の文言を返す', () => {
    expect(ratingLabel(3)).toBe('5段階中 3')
  })
})

describe('scaleText', () => {
  const scale = ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ'] as const

  it('段階に対応する説明を引く', () => {
    expect(scaleText(scale, 1)).toBe('ひとつ')
    expect(scaleText(scale, 5)).toBe('いつつ')
  })

  it('短い配列を渡されても落ちない', () => {
    expect(scaleText(['のみ'], 4)).toBe('')
  })
})

describe('formatYear', () => {
  it('年表の見出しを作る', () => {
    expect(formatYear('2014')).toBe('2014年 —')
  })
})

describe('hostname', () => {
  it('www を落とす', () => {
    expect(hostname('https://www.example.com/a/b')).toBe('example.com')
  })

  it('URL でなければ空文字', () => {
    expect(hostname('not a url')).toBe('')
  })
})

describe('byRatingDesc', () => {
  const skills: Skill[] = [
    { name: 'a', rating: 3 },
    { name: 'b', rating: 5 },
    { name: 'c', rating: 3 },
    { name: 'd', rating: 1 },
  ]

  it('評価の高い順に並べる', () => {
    expect(byRatingDesc(skills).map((s) => s.name)).toEqual(['b', 'a', 'c', 'd'])
  })

  it('元の配列を壊さない', () => {
    const before = skills.map((s) => s.name)
    byRatingDesc(skills)
    expect(skills.map((s) => s.name)).toEqual(before)
  })
})

describe('countLabel', () => {
  it('0 件でも省略しない', () => {
    expect(countLabel(0)).toBe('0 件')
  })

  it('単位を差し替えられる', () => {
    expect(countLabel(12, '冊')).toBe('12 冊')
  })
})

describe('anchorId', () => {
  it('英数字の見出しからアンカーを作る', () => {
    expect(anchorId('work', 'Raspberry Pi 4')).toBe('work-raspberry-pi-4')
  })

  it('英数字が無ければ接頭辞だけ返す', () => {
    expect(anchorId('sec', '建築')).toBe('sec')
  })
})
