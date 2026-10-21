import { useEffect, useRef, useState } from 'react'
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './integrations/supabase/client'
import './DemoPanel.css'

// Presenter-only controls, so nothing has to be typed or pasted on stage.
// The SQL buttons call demo_control() from supabase/demo-controls.sql.
const PASSPHRASE = 'QcWId9ZY063kTmjB'

const ATTACK_CODE = `fetch(SUPABASE_URL + '/rest/v1/students?select=*', {
  headers: { apikey: PUBLIC_KEY }
})`

const STEPS = [
  { n: 2, action: 'lock', title: 'Turn the lock on', sql: 'ALTER TABLE public.students\n  ENABLE ROW LEVEL SECURITY;' },
  { n: 3, action: 'policy', title: 'Add a real rule', sql: 'CREATE POLICY "own rows only" ON public.students\n  FOR SELECT USING (auth.uid() = user_id);' },
  { n: 4, action: 'bad_policy', title: 'The fake fix (then run ① again)', sql: 'CREATE POLICY "allow all" ON public.students\n  FOR SELECT USING (true);' },
]

export default function DemoPanel() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const lastRequest = useRef(0)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`' && !e.target.closest?.('input, textarea')) setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKey)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => {
      window.removeEventListener('keydown', onKey)
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (open) control('status')
  }, [open])

  async function control(action) {
    const request = ++lastRequest.current
    if (action !== 'status') setBusy(action) // a status check shouldn't block the buttons
    setError(null)
    const { data, error } = await supabase.rpc('demo_control', { action, passphrase: PASSPHRASE })
    if (request === lastRequest.current) { // ignore an older reply that arrives late
      if (error) setError(error.message.includes('demo_control') ? 'Run supabase/demo-controls.sql once in Supabase.' : error.message)
      else setStatus(data)
    }
    if (action !== 'status') {
      setRows(null) // old attacker result no longer applies
      window.dispatchEvent(new Event('demo-refresh'))
      setBusy(null)
    }
  }

  async function attack() {
    setBusy('attack')
    setError(null)
    // No login, no app: just the URL and the public key, like curl would.
    const res = await fetch(`${SUPABASE_URL}/rest/v1/students?select=*`, { headers: { apikey: SUPABASE_PUBLISHABLE_KEY } })
    const data = await res.json()
    if (Array.isArray(data)) {
      console.table(data)
      setRows(data)
    } else setError(data.message)
    setBusy(null)
  }

  const signIn = () => supabase.auth.signInWithPassword({ email: 'aina@campus.example', password: 'test123' })
  const policies = status?.policies ?? []

  if (!open) {
    return <button type="button" className="dp-pill" onClick={() => setOpen(true)} title="Demo controls (`)">Demo</button>
  }

  return (
    <aside className="dp" aria-label="Demo controls">
      <header className="dp-head">
        <b>Demo controls</b>
        {status && (
          <span className="dp-chips">
            <span className={status.rls ? 'ok' : 'bad'}>RLS {status.rls ? 'ON' : 'OFF'}</span>
            <span className={policies.includes('allow all') ? 'bad' : policies.length ? 'ok' : ''}>
              {policies.length ? policies.join(', ') : 'no policies'}
            </span>
          </span>
        )}
        <button type="button" className="dp-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
      </header>

      <div className="dp-body">
        <section className="dp-step">
          <div className="dp-title"><i>1</i>Read every student, no login</div>
          <pre>{ATTACK_CODE}</pre>
          <button type="button" className="dp-run danger" onClick={attack} disabled={!!busy}>
            {busy === 'attack' ? 'Running…' : 'Run as attacker'}
          </button>
          {rows && (
            <div className="dp-result">
              <div className="dp-count">{rows.length} rows</div>
              {rows.length === 0 ? <code>[]</code> : (
                <table>
                  <tbody>
                    {rows.slice(0, 4).map((r) => (
                      <tr key={r.id}><td>{r.full_name}</td><td>{r.matric_no}</td><td>{r.phone}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
              {rows.length > 4 && <div className="dp-more">…and {rows.length - 4} more</div>}
            </div>
          )}
        </section>

        {STEPS.map((s) => (
          <section className="dp-step" key={s.action}>
            <div className="dp-title"><i>{s.n}</i>{s.title}</div>
            <pre>{s.sql}</pre>
            <div className="dp-row">
              <button type="button" className="dp-run" onClick={() => control(s.action)} disabled={!!busy}>
                {busy === s.action ? 'Running…' : 'Run SQL'}
              </button>
              {s.action === 'policy' && !user && (
                <button type="button" className="dp-run ghost" onClick={signIn} disabled={!!busy}>Sign in as Aina</button>
              )}
            </div>
          </section>
        ))}

        {error && <p className="dp-error">{error}</p>}
      </div>

      <footer className="dp-foot">
        <button type="button" className="dp-run ghost" onClick={() => control('reset')} disabled={!!busy}>
          {busy === 'reset' ? 'Resetting…' : 'Reset demo'}
        </button>
        {user && <button type="button" className="dp-run ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>}
      </footer>
    </aside>
  )
}
