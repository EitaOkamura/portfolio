import { useId, useState, type ReactNode } from 'react'

/** 開閉する塊。aria-expanded と aria-controls をここで閉じておき、
 *  使う側が付け忘れられないようにする。 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
  bodyClassName = '',
  buttonClassName = '',
  markClassName = '',
}: {
  summary: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  bodyClassName?: string
  buttonClassName?: string
  markClassName?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className={className}>
      <button
        type="button"
        className={buttonClassName}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {summary}
        <span className={markClassName} aria-hidden="true">
          +
        </span>
      </button>
      <div id={id} className={bodyClassName} hidden={!open}>
        {children}
      </div>
    </div>
  )
}
