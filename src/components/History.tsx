import { SectionHead } from './SectionHead'
import { history } from '../content/history'
import { closing } from '../content/profile'
import { formatYear } from '../format'

export function History() {
  return (
    <section className="section" id="history">
      <div className="shell">
        <SectionHead tag="05 — History" title="History" />

        <ol className="timeline">
          {history.map((entry) => (
            <li className="tl-item" key={entry.year}>
              <p className="tl-item__year">{formatYear(entry.year)}</p>
              <h3 className="tl-item__title">{entry.title}</h3>
              <p className="tl-item__body">{entry.body}</p>
            </li>
          ))}
        </ol>

        <div className="prose" style={{ marginTop: '72px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>{closing.title}</h3>
          {closing.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
