'use client'
// LEAKY: calls the AI straight from the browser, so the key ships to every visitor.
import Chat from './Chat'
import { chatCompletion } from '../lib/fakeOpenAI'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export default function Page() {
  return <Chat ask={(messages) => chatCompletion({ apiKey: OPENAI_API_KEY, messages })} />
}
