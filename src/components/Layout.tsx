import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { site } from '../content/profile'

const NAV = [
  { href: '/#about', label: 'ABOUT' },
  { href: '/#profile', label: 'PROFILE' },
  { href: '/#skills', label: 'SKILLS' },
  { href: '/#works', label: 'WORKS' },
  { href: '/#history', label: 'HISTORY' },
  { href: '/#contact', label: 'CONTACT' },
]

type Theme = 'dark' | 'light'

/** OS の設定を既定にしつつ、明示的に切り替えたらそれを覚える。
 *  localStorage は private window 等で読み書きが例外になるため必ず try で囲む。 */
function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem('theme')
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(() => readStoredTheme())

  useEffect(() => {
    const root = document.documentElement
    if (theme) root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
    try {
      if (theme) localStorage.setItem('theme', theme)
    } catch {
      /* 保存できなくても表示は成立する */
    }
  }, [theme])

  const resolved: Theme =
    theme ??
    (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark')

  return { resolved, toggle: () => setTheme(resolved === 'dark' ? 'light' : 'dark') }
}

/** ページ遷移でスクロール位置を戻す。アンカー付きのときはブラウザに任せる。 */
function useScrollReset() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // 別ページからハッシュ付きで来た場合、React Router はスクロールしてくれない。
    // 描画が終わってから対象を探す。
    const id = hash.slice(1)
    const target = document.getElementById(id)
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' })
    // pathname は本体で使っていないが、依存配列から外せない。
    // ハッシュ無しのページ間を移動したとき hash は '' のまま変わらないので、
    // pathname が無いと効果が再実行されずスクロール位置が戻らない。
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [pathname, hash])
}

export function Layout() {
  const { resolved, toggle } = useTheme()
  useScrollReset()

  return (
    <>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>

      <header className="site-header">
        <div className="shell site-header__inner">
          <Link to="/" className="brand">
            {site.name}
          </Link>
          <nav className="nav" aria-label="サイト内ナビゲーション">
            {NAV.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={resolved === 'dark' ? '明るい配色に切り替える' : '暗い配色に切り替える'}
          >
            {resolved === 'dark' ? 'LIGHT' : 'DARK'}
          </button>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <p>© {new Date().getFullYear()} {site.owner}</p>
          <nav aria-label="外部リンク">
            {site.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
