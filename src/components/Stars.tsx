import { ratingLabel, starParts } from '../format'
import type { Rating } from '../content/types'

/** ★の羅列は読み上げても意味を成さないので、図形は aria-hidden にしてラベルを別に出す。 */
export function Stars({ rating }: { rating: Rating }) {
  const { filled, empty } = starParts(rating)
  return (
    <span className="stars" role="img" aria-label={ratingLabel(rating)}>
      {Array.from({ length: filled }, (_, i) => (
        <span key={`on-${i}`} data-on="1" aria-hidden="true" />
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`off-${i}`} aria-hidden="true" />
      ))}
    </span>
  )
}
