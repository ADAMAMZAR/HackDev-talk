// Starts every demo server in this one window, then opens the first demo.
// Use the hidden top navbar (move the mouse to the top edge) to switch demos.
// Close this window (or press Ctrl+C) to stop everything.
// Usage: node run-all.mjs [--no-open]
import { spawn, exec } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const here = fileURLToPath(new URL('.', import.meta.url))

const SERVERS = [
  ['01-leadsnap', 5101],
  ['02-studybuddy', 5102],
  ['03-campusconnect', 5103],
  ['04b-stale-deps', 5104],
]

// Port 5100 serves the static demos and the shared navbar. Only these exact paths are served.
const STATIC = {
  '/nav.js': 'nav.js',
  '/04a-mcp-plugin/': '04a-mcp-plugin/index.html',
  '/04c-agent-console/': '04c-agent-console/index.html',
  '/05-kopicheck/': '05-kopicheck/index.html',
}

createServer(async (req, res) => {
  const file = STATIC[new URL(req.url, 'http://localhost').pathname]
  if (!file) {
    res.writeHead(404).end('Not found')
    return
  }
  const type = file.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8'
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  res.end(await readFile(join(here, file)))
}).listen(5100, () => console.log('[static] http://localhost:5100'))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitFor(url, seconds = 120) {
  for (let i = 0; i < seconds * 2; i++) {
    try {
      if ((await fetch(url)).ok) return true
    } catch {}
    await sleep(500)
  }
  return false
}

for (const [dir] of SERVERS) {
  const child = spawn('npm run dev', { cwd: join(here, dir), shell: true })
  const print = (data) => {
    for (const line of data.toString().split(/\r?\n/)) if (line.trim()) console.log(`[${dir}] ${line}`)
  }
  child.stdout.on('data', print)
  child.stderr.on('data', print)
  child.on('exit', (code) => console.log(`[${dir}] stopped (exit ${code})`))
}

console.log('Starting the demo servers...')
const ready = await Promise.all(SERVERS.map(([, port]) => waitFor(`http://localhost:${port}/`)))
SERVERS.forEach(([dir, port], i) => console.log(`${ready[i] ? 'ready ' : 'FAILED'}  ${dir}  http://localhost:${port}`))

// StudyBuddy compiles each page on first visit, so warm both pages up before the talk.
await waitFor('http://localhost:5102/fixed')

if (!process.argv.includes('--no-open')) exec('start "" "http://localhost:5101/"')

console.log('\nAll demos are running. Move the mouse to the top edge of any demo to switch.')
console.log('Close this window to stop them.')
