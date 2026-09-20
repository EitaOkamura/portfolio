import { Link } from 'react-router-dom'
import { SectionHead } from './SectionHead'
import { works } from '../content/works'

export function Works() {
  return (
    <section className="section" id="works">
      <div className="shell">
        <SectionHead
          tag="04 — Works"
          title="Works"
          lead="IT と建築の両方から、手がけたものをまとめました。"
        />

        <div className="works">
          {works.map((work) => {
            const inner = (
              <>
                <span className="work__no">{work.index}</span>
                <div>
                  <h3 className="work__title">{work.title}</h3>
                  <p className="work__summary">{work.summary}</p>
                  {work.note ? <p className="work__note">{work.note}</p> : null}
                  {work.stack ? (
                    <div className="chips">
                      {work.stack.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {work.detailPath ? <span className="work__more">詳細 →</span> : null}
              </>
            )

            return work.detailPath ? (
              <Link className="work" to={work.detailPath} key={work.id}>
                {inner}
              </Link>
            ) : (
              <div className="work" key={work.id}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
