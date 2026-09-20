import { SectionHead } from './SectionHead'
import { Disclosure } from './Disclosure'
import { bookShelves } from '../content/books'
import { countLabel } from '../format'

export function Books() {
  return (
    <section className="section" id="books">
      <div className="shell">
        <SectionHead
          tag="06 — Reading"
          title="技術書"
          lead="建築と IT でこれまでに読んだ技術書です。冊数が多いので畳んであります。"
        />

        {bookShelves.map((shelf) => {
          const total = shelf.it.length + shelf.architecture.length
          return (
            <Disclosure
              key={shelf.id}
              className="shelf"
              buttonClassName="shelf__btn"
              bodyClassName="shelf__body"
              markClassName="shelf__mark"
              summary={
                <>
                  <span>{shelf.title}</span>
                  <span className="shelf__count">{countLabel(total, '冊')}</span>
                </>
              }
            >
              <div className="shelf__group">
                <h4>IT・研究関連 — {countLabel(shelf.it.length, '冊')}</h4>
                <ul>
                  {shelf.it.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="shelf__group">
                <h4>建築関連 — {countLabel(shelf.architecture.length, '冊')}</h4>
                <ul>
                  {shelf.architecture.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </Disclosure>
          )
        })}
      </div>
    </section>
  )
}
