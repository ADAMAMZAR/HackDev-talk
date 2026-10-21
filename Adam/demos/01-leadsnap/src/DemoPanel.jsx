import { useEffect, useState } from 'react'
import appSource from './App.jsx?raw'
import './DemoPanel.css'

// Presenter-only controls, so nothing has to be typed or copied from files on stage.
const PROMPT = `Act as an attacker. List every way someone could steal data,
bypass payment, or run up my bills in this code.
Rank them by severity and show the fix for each.`

export default function DemoPanel() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null)
  const isPro = localStorage.getItem('plan') === 'pro'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`' && !e.target.closest?.('input, textarea')) setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function copyPrompt() {
    const text = `${PROMPT}\n\n\`\`\`jsx\n${appSource}\`\`\``
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard API refuses when the window isn't focused; the old way still works.
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.append(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      if (!ok) return setCopied({ ok: false, text: 'Copy failed. Click the page, then try again.' })
    }
    setCopied({ ok: true, text: 'Copied. Paste it into any AI with Ctrl+V.' })
  }

  function setPlan(pro) {
    if (pro) localStorage.setItem('plan', 'pro')
    else localStorage.removeItem('plan')
    location.reload()
  }

  if (!open) {
    return <button type="button" className="dp-pill" onClick={() => setOpen(true)} title="Demo controls (`)">Demo</button>
  }

  return (
    <aside className="dp" aria-label="Demo controls">
      <header className="dp-head">
        <b>Demo controls</b>
        <span className="dp-chips"><span className={isPro ? 'bad' : ''}>{isPro ? 'Pro (unpaid!)' : 'Free plan'}</span></span>
        <button type="button" className="dp-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
      </header>

      <div className="dp-body">
        <section className="dp-step">
          <div className="dp-title"><i>1</i>Skip the paywall, no payment</div>
          <pre>{isPro ? "localStorage.removeItem('plan')" : "localStorage.plan = 'pro'"}</pre>
          <button type="button" className={isPro ? 'dp-run ghost' : 'dp-run danger'} onClick={() => setPlan(!isPro)}>
            {isPro ? 'Back to Free plan' : 'Unlock Pro as attacker'}
          </button>
        </section>

        <section className="dp-step">
          <div className="dp-title"><i>2</i>Ask the AI to attack this code</div>
          <pre>{PROMPT}</pre>
          <p className="dp-note">Copies this prompt plus all of <code>src/App.jsx</code> ({appSource.split('\n').length} lines).</p>
          <button type="button" className="dp-run" onClick={copyPrompt}>Copy prompt + code</button>
          {copied && <p className={copied.ok ? 'dp-ok' : 'dp-error'}>{copied.text}</p>}
        </section>
      </div>
    </aside>
  )
}
