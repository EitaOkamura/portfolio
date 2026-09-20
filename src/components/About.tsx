import { SectionHead } from './SectionHead'
import { Disclosure } from './Disclosure'
import { aboutSite, profile, profileQA } from '../content/profile'

export function About() {
  return (
    <section className="section" id="about">
      <div className="shell">
        <SectionHead tag="01 — About" title={aboutSite.title} />
        <div className="prose">
          {aboutSite.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Profile() {
  return (
    <section className="section" id="profile">
      <div className="shell">
        <SectionHead tag="02 — Profile" title={profile.title} />
        <div className="prose" style={{ marginBottom: '48px' }}>
          {profile.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="qa">
          {profileQA.map((qa, i) => (
            <Disclosure
              key={qa.question}
              className="qa__item"
              buttonClassName="qa__btn"
              bodyClassName="qa__body"
              markClassName="qa__mark"
              summary={
                <>
                  <span className="qa__no">Q{String(i + 1).padStart(2, '0')}</span>
                  <span className="qa__q">{qa.question}</span>
                </>
              }
            >
              {qa.answer.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  )
}
