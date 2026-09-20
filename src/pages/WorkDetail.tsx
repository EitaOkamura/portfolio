import { Link, useParams } from 'react-router-dom'
import { detailPages } from '../content/details'
import { works } from '../content/works'
import { NotFound } from './NotFound'

export function WorkDetail() {
  const { workId } = useParams()
  const page = workId ? detailPages[workId] : undefined
  const work = works.find((w) => w.id === workId)

  if (!page) return <NotFound />

  return (
    <>
      <div className="detail-head">
        <div className="shell">
          <Link to="/#works" className="back-link">
            ← WORKS へ戻る
          </Link>
          <h1>{page.title}</h1>
          <div className="prose">
            {page.lead.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          {work?.stack ? (
            <div className="chips" style={{ marginTop: '24px' }}>
              {work.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {page.sections.map((section) => (
        <section className="detail-section" id={section.id} key={section.id}>
          <div className="shell">
            <h2>{section.title}</h2>
            {section.blocks.map((block) => (
              <div className="block" key={block.heading}>
                <h3>{block.heading}</h3>
                <div className="prose">
                  {block.body.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                {block.figures ? (
                  <div className="figures">
                    {block.figures.map((fig) => (
                      <figure className="figure" key={fig.src}>
                        <img src={fig.src} alt={fig.alt} loading="lazy" decoding="async" />
                        <figcaption>{fig.alt}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="shell" style={{ paddingBottom: '80px' }}>
        <Link to="/#works" className="btn">
          ← WORKS へ戻る
        </Link>
      </div>
    </>
  )
}
