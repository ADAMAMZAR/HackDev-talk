// Stand-in for the OpenAI API, so the demo works offline with a fake key.
// The real call would be:
//   fetch('https://api.openai.com/v1/chat/completions', { headers: { Authorization: `Bearer ${apiKey}` }, ... })

const INSIGHTS = [
  'is hiring 3 sales reps this quarter. Good time to pitch tooling.',
  'just opened a new branch in Penang. Expect new budget for vendors.',
  'posted about slow lead follow-up on LinkedIn last week. Lead with speed.',
  'renewed their CRM contract in March. Focus on add-ons, not replacement.',
]

export async function chatCompletion({ apiKey, messages }) {
  if (!apiKey) throw new Error('Missing API key')
  await new Promise((r) => setTimeout(r, 900))
  const prompt = messages.at(-1).content
  const company = prompt.match(/about (.+?) \(/)?.[1] ?? 'This company'
  return `${company} ${INSIGHTS[company.length % INSIGHTS.length]}`
}
