import { site } from '../content/profile'
import { skillDomains } from '../content/skills'
import { works } from '../content/works'
import { bookShelves } from '../content/books'

/** 経歴の要点を数字で置く。建築の図面が持つ「寸法が書いてある」感じに寄せる。 */
function stats() {
  const skills = skillDomains.reduce(
    (n, d) => n + d.groups.reduce((m, g) => m + g.skills.length, 0),
    0,
  )
  const books = bookShelves.reduce((n, s) => n + s.it.length + s.architecture.length, 0)
  return [
    { label: '建築実務', value: '9', unit: '年' },
    { label: '構造設計', value: '2', unit: '年3ヶ月' },
    { label: '扱った技術', value: String(skills), unit: '件' },
    { label: '作品', value: String(works.length), unit: '件' },
    { label: '技術書', value: String(books), unit: '冊' },
  ]
}

export function Hero() {
  return (
    <section className="hero">
      <div className="shell hero__inner">
        <p className="hero__label">Portfolio / Eita Okamura</p>
        <h1>
          {site.taglineLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero__sub">STRUCTURAL ENGINEER → SOFTWARE ENGINEER</p>
        <p className="hero__lead">{site.description}</p>

        <div className="hero__links">
          <a className="btn btn--primary" href="#works">
            作品を見る
          </a>
          <a className="btn" href="#contact">
            お問い合わせ
          </a>
          {site.links.map((l) => (
            <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer noopener">
              {l.label} ↗
            </a>
          ))}
        </div>

        <dl className="hero__stats">
          {stats().map((s) => (
            <div key={s.label} className="hero__stat">
              <dt>{s.label}</dt>
              <dd>
                {s.value}
                <small>{s.unit}</small>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
