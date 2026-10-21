'use client'
// FIXED: the browser only talks to our own server route. The key never leaves the server.
import Chat from '../Chat'

async function ask(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error('Chat failed')
  return (await res.json()).reply
}

export default function Page() {
  return <Chat ask={ask} />
}
