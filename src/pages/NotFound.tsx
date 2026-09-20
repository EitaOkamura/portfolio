import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="shell notfound">
      <h1>404</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link className="btn btn--primary" to="/">
        トップへ戻る
      </Link>
    </div>
  )
}
