'use client'
import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = ['Explain recursion like I’m 5', 'Quiz me on the OSI layers', 'What is Big-O, simply?']

export default function Chat({ ask }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  async function send(text) {
    if (!text.trim() || busy) return
    const next = [...messages, { role: 'user', content: text.trim() }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const reply = await ask(next)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }])
    }
    setBusy(false)
  }

  return (
    <div className="shell">
      <header className="top">
        <div className="logo"><span className="logo-mark">S</span>StudyBuddy</div>
        <span className="pill">Finals mode</span>
      </header>

      <main className="thread">
        {messages.length === 0 ? (
          <section className="hello">
            <h1>Stuck on something? <mark>Ask me.</mark></h1>
            <p>Your AI study partner for late nights before exams.</p>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </section>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>{m.content}</div>
          ))
        )}
        {busy && <div className="msg assistant typing" aria-label="StudyBuddy is typing"><i /><i /><i /></div>}
        <div ref={endRef} />
      </main>

      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input) }}>
        <label htmlFor="q" className="sr-only">Your question</label>
        <input id="q" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your subjects…" autoComplete="off" />
        <button type="submit" disabled={busy || !input.trim()}>Ask</button>
      </form>

      <div className="demo-note">Demo app · fake key</div>
    </div>
  )
}
