import { useState, type FormEvent } from 'react'
import { SectionHead } from './SectionHead'
import { contactEndpoint } from '../content/profile'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus({ kind: 'sending' })
    try {
      const res = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          // 罠のフィールド。自動送信だけが埋める。
          website: data.get('website'),
        }),
      })
      // 旧方式と違い、ここで実際の結果が分かる。
      const body: { ok?: boolean; error?: string } = await res.json().catch(() => ({}))
      if (!res.ok || !body.ok) {
        setStatus({ kind: 'error', message: body.error ?? '送信に失敗しました' })
        return
      }
      setStatus({ kind: 'sent' })
      form.reset()
    } catch {
      setStatus({ kind: 'error', message: 'ネットワークに接続できませんでした' })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <section className="section" id="contact">
      <div className="shell">
        <SectionHead
          tag="07 — Contact"
          title="Contact"
          lead="下記フォームに必要事項を入力して送信してください。返信は入力いただいたメールアドレス宛に差し上げます。"
        />

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="cf-name">
              お名前<span className="req">必須</span>
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="株式会社 〇〇"
              maxLength={100}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="cf-email">
              メールアドレス<span className="req">必須</span>
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="sample@example.com"
              maxLength={254}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="cf-message">お問い合わせ内容</label>
            <textarea
              id="cf-message"
              name="message"
              rows={6}
              maxLength={4000}
              placeholder="お問い合わせ内容"
            />
          </div>

          {/* 罠。人間には見えず、読み上げもされず、Tab でも止まらない。 */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="cf-website">この欄は入力しないでください</label>
            <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {status.kind === 'sent' ? (
            <p className="form__status" role="status">
              送信しました。内容を確認のうえ返信いたします。
            </p>
          ) : null}
          {status.kind === 'error' ? (
            <p className="form__status form__error" role="alert">
              {status.message}
            </p>
          ) : null}

          <div>
            <button type="submit" className="btn btn--primary" disabled={sending}>
              {sending ? '送信中…' : '送信する'}
            </button>
          </div>
        </form>

        <p className="prose" style={{ marginTop: '40px' }}>
          最後までご覧いただきありがとうございます。このサイトや私について何かありましたら、
          上記のお問い合わせフォームをご利用ください。
        </p>
      </div>
    </section>
  )
}
