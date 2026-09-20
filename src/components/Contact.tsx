import { useRef, useState, type FormEvent } from 'react'
import { SectionHead } from './SectionHead'
import { contactForm } from '../content/profile'

type Status = 'idle' | 'sent' | 'invalid'

/** Google フォームへ POST する。CORS が許可されていないため fetch は使えず、
 *  旧サイトと同じく非表示の iframe を target にして送信する。
 *  この方式では送信結果を読み取れないので、成功の断定はしない文言にしてある。 */
export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get(contactForm.fields.name) ?? '').trim()
    const email = String(data.get(contactForm.fields.email) ?? '').trim()

    if (!name || !email) {
      e.preventDefault()
      setStatus('invalid')
      return
    }
    // 送信自体は iframe 側で進む。ここでは画面の状態だけ更新する。
    setStatus('sent')
    setTimeout(() => formRef.current?.reset(), 0)
  }

  return (
    <section className="section" id="contact">
      <div className="shell">
        <SectionHead
          tag="07 — Contact"
          title="Contact"
          lead="下記フォームに必要事項を入力して送信してください。Google フォーム宛に届きます。"
        />

        <form
          ref={formRef}
          className="form"
          method="post"
          action={contactForm.action}
          target="contact_sink"
          onSubmit={handleSubmit}
        >
          <div className="field">
            <label htmlFor="cf-name">
              お名前<span className="req">必須</span>
            </label>
            <input
              id="cf-name"
              name={contactForm.fields.name}
              type="text"
              autoComplete="name"
              placeholder="株式会社 〇〇"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="cf-email">
              メールアドレス<span className="req">必須</span>
            </label>
            <input
              id="cf-email"
              name={contactForm.fields.email}
              type="email"
              autoComplete="email"
              placeholder="sample@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="cf-message">お問い合わせ内容</label>
            <textarea
              id="cf-message"
              name={contactForm.fields.message}
              rows={6}
              placeholder="お問い合わせ内容"
            />
          </div>

          {status === 'sent' ? (
            <p className="form__status" role="status">
              送信しました。内容を確認のうえ返信いたします。
            </p>
          ) : null}
          {status === 'invalid' ? (
            <p className="form__status form__error" role="alert">
              お名前とメールアドレスを入力してください。
            </p>
          ) : null}

          <div>
            <button type="submit" className="btn btn--primary">
              送信する
            </button>
          </div>
        </form>

        {/* 送信先。ページ遷移させないために置いている */}
        <iframe name="contact_sink" title="送信先" style={{ display: 'none' }} />

        <p className="prose" style={{ marginTop: '40px' }}>
          最後までご覧いただきありがとうございます。このサイトや私について何かありましたら、
          上記のお問い合わせフォームをご利用ください。
        </p>
      </div>
    </section>
  )
}
