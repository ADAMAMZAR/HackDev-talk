import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { chatCompletion } from './fakeOpenAI'

const supabase = createClient(
  'https://brzqnzxeoummpyptdfiq.supabase.co',
  'sb_publishable_HLBrwPe_pLLxr8Ya_KfrrA_QDHvytmm'
)

const OPENAI_API_KEY = 'sk-proj-LeadSnapDEMO_9fK2mQ7xR4vT1nB8cW3yH6jL0pZ5sD'

const rm = (n) => 'RM' + n.toLocaleString('en-MY')

export default function App() {
  const [leads, setLeads] = useState([])
  const [query, setQuery] = useState('')
  const [insights, setInsights] = useState({})
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const isPro = localStorage.getItem('plan') === 'pro'

  useEffect(() => {
    supabase
      .from('leads')
      .select('*')
      .order('deal_value', { ascending: false })
      .then(({ data }) => setLeads(data ?? []))
  }, [])

  async function enrich(lead) {
    setInsights((s) => ({ ...s, [lead.id]: null }))
    const text = await chatCompletion({
      apiKey: OPENAI_API_KEY,
      messages: [{ role: 'user', content: `Write a one-line sales insight about ${lead.company} (${lead.industry}).` }],
    })
    setInsights((s) => ({ ...s, [lead.id]: text }))
  }

  function exportCsv() {
    const rows = [['Company', 'Contact', 'Title', 'Email', 'Phone', 'Deal value']]
    leads.forEach((l) => rows.push([l.company, l.contact, l.title, l.email, l.phone, l.deal_value]))
    const csv = rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'leadsnap-leads.csv'
    a.click()
  }

  const shown = leads.filter((l) => (l.company + l.contact + l.industry).toLowerCase().includes(query.toLowerCase()))
  const pipeline = leads.reduce((sum, l) => sum + l.deal_value, 0)

  return (
    <div className="app">
      <aside className="side">
        <div className="logo">Lead<span>Snap</span></div>
        <nav>
          <a className="active">Leads</a>
          <a>Lists</a>
          <a>Sequences</a>
          <a>Settings</a>
        </nav>
        <div className="plan-card">
          <div className="plan-name">{isPro ? 'Pro plan' : 'Free plan'}</div>
          {isPro ? (
            <p>Unlimited exports and full contact details.</p>
          ) : (
            <>
              <p>Unlock emails, phone numbers and CSV export.</p>
              <button type="button" className="btn-lime" onClick={() => setUpgradeOpen(true)}>Upgrade · RM49/mo</button>
              {upgradeOpen && <p className="soon">Card payments are launching soon.</p>}
            </>
          )}
        </div>
      </aside>

      <main className="main">
        <header className="head">
          <div>
            <h1>Leads</h1>
            <p className="sub">AI-found prospects across Malaysia, refreshed daily.</p>
          </div>
          <button type="button" className="btn-dark" onClick={exportCsv} disabled={!isPro}>
            {isPro ? 'Export CSV' : '🔒 Export CSV'}
          </button>
        </header>

        <section className="stats">
          <div><span>Leads found</span><b>{leads.length}</b></div>
          <div><span>Pipeline value</span><b>{rm(pipeline)}</b></div>
          <div><span>AI insights today</span><b>{Object.keys(insights).length}</b></div>
        </section>

        <input className="search" placeholder="Search company, contact or industry…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search leads" />

        <table className="leads">
          <thead>
            <tr><th>Company</th><th>Contact</th><th>Email</th><th>Phone</th><th className="num">Deal</th><th /></tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.id}>
                <td><b>{l.company}</b><small>{l.industry}</small>{l.id in insights && <em className="insight">{insights[l.id] ?? 'Thinking…'}</em>}</td>
                <td>{l.contact}<small>{l.title}</small></td>
                <td className={isPro ? '' : 'locked'}>{l.email}</td>
                <td className={isPro ? 'phone' : 'phone locked'}>{l.phone}</td>
                <td className="num">{rm(l.deal_value)}</td>
                <td><button type="button" className="btn-ghost" onClick={() => enrich(l)}>✨ Enrich</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <div className="demo-note">Demo app · fake data, fake key</div>
    </div>
  )
}
