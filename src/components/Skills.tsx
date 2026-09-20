import { useState } from 'react'
import { SectionHead } from './SectionHead'
import { Stars } from './Stars'
import { skillDomains } from '../content/skills'

export function Skills() {
  const [active, setActive] = useState(skillDomains[0].id)
  const domain = skillDomains.find((d) => d.id === active) ?? skillDomains[0]

  return (
    <section className="section" id="skills">
      <div className="shell">
        <SectionHead tag="03 — Skills" title="My skill set" lead={domain.lead} />

        <div className="tabs" role="tablist" aria-label="スキルの分野">
          {skillDomains.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={d.id === active}
              aria-controls={`skills-${d.id}`}
              id={`tab-${d.id}`}
              onClick={() => setActive(d.id)}
            >
              {d.title}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`skills-${domain.id}`} aria-labelledby={`tab-${domain.id}`}>
          <div className="scale">
            <p className="scale__title">評価軸</p>
            <dl className="scale__list">
              {domain.scale.map((text, i) => {
                const rating = (i + 1) as 1 | 2 | 3 | 4 | 5
                return (
                  <div className="scale__row" key={text}>
                    <dt>
                      <Stars rating={rating} />
                    </dt>
                    <dd>{text}</dd>
                  </div>
                )
              })}
            </dl>
          </div>

          {domain.groups.map((group) => (
            <div className="skill-group" key={group.id}>
              <div className="skill-group__head">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <div className="skill-list">
                {group.skills.map((skill) => (
                  <div className="skill" key={skill.name}>
                    <span className="skill__name">{skill.name}</span>
                    <Stars rating={skill.rating} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {domain.learning ? (
            <div className="learning">
              <h3>{domain.learning.title}</h3>
              <p>{domain.learning.description}</p>
              <div className="chips">
                {domain.learning.items.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
