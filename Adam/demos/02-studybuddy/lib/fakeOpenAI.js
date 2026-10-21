// Stand-in for the OpenAI API, so the demo works offline with a fake key.
// The real call would be:
//   fetch('https://api.openai.com/v1/chat/completions', { headers: { Authorization: `Bearer ${apiKey}` }, ... })

const ANSWERS = [
  [/recurs/i, "Recursion is when a function solves a problem by calling itself on a smaller version of it. Think of Russian dolls: to open the whole set, you open one doll, then do the same thing to the doll inside, until you reach the smallest one. That smallest doll is the base case, where you stop."],
  [/osi|layer|network/i, "Here's a quick one: which OSI layer does a router work at?\n\nA) Data Link\nB) Network\nC) Transport\n\nReply with your answer and I'll explain it."],
  [/big.?o|complexity/i, "Big-O describes how an algorithm's work grows as the input grows. O(1) stays the same, O(n) grows in step with the input, and O(n²) grows much faster. A loop inside a loop over the same list is usually O(n²)."],
]

export async function chatCompletion({ apiKey, messages }) {
  if (!apiKey) throw new Error('Missing API key')
  await new Promise((r) => setTimeout(r, 700))
  const question = messages.at(-1).content
  return ANSWERS.find(([re]) => re.test(question))?.[1]
    ?? "Good question! Break it into smaller parts and tell me which part feels confusing. We'll go through it step by step."
}
