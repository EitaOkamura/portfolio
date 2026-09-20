/** 節の見出し。製図の寸法線に見立てたタグを必ず伴う。 */
export function SectionHead({
  tag,
  title,
  lead,
}: {
  tag: string
  title: string
  lead?: string
}) {
  return (
    <div className="section-head">
      <p className="section-head__tag">{tag}</p>
      <h2>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  )
}
