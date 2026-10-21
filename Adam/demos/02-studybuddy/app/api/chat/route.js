// app/api/chat/route.js  (runs on the server, not in the browser)
import { chatCompletion } from '../../../lib/fakeOpenAI'

export async function POST(req) {
  const { messages } = await req.json()
  if (!Array.isArray(messages) || !messages.length) {
    return Response.json({ error: 'messages required' }, { status: 400 })
  }

  const key = process.env.OPENAI_API_KEY
  const reply = await chatCompletion({ apiKey: key, messages })
  return Response.json({ reply })
}
