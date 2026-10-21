// Presenter-only terminal. Runs the real npm commands through the dev server
// (endpoints in vite.config.js), so the audit demo needs no terminal window.

const COMMANDS = [
  ['audit', 'npm audit', 'npm audit'],
  ['update', 'Update packages', 'npm install axios@latest lodash@latest'],
  ['reset', 'Reset', 'git checkout -- package.json package-lock.json && npm install'],
]

const pill = Object.assign(document.createElement('button'), { type: 'button', className: 'dp-pill', textContent: 'Demo' })
const term = document.createElement('section')
term.className = 'dt'
term.hidden = true
term.setAttribute('aria-label', 'Demo terminal')
term.innerHTML = `
  <header>
    <span class="dt-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <b>Terminal · kedaikita</b>
    <span class="dt-vers" id="dt-vers"></span>
    <span class="dt-btns">${COMMANDS.map(([id, label]) => `<button type="button" data-cmd="${id}" class="${id === 'reset' ? 'ghost' : ''}">${label}</button>`).join('')}</span>
    <button type="button" class="dt-x" aria-label="Close">×</button>
  </header>
  <pre class="dt-out" aria-live="polite"></pre>`
document.body.append(pill, term)

const out = term.querySelector('.dt-out')
const buttons = term.querySelectorAll('[data-cmd]')
let log = []

const save =() => { try { sessionStorage.setItem('demo-term', JSON.stringify({ open: !term.hidden, log })) } catch {} }

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
function lineClass(l) {
  if (l.startsWith('$ ')) return 'prompt'
  if (/found 0 vulnerabilities/.test(l)) return 'good'
  if (/\d+ (high|critical|moderate|low) severity|Severity: (high|critical)/i.test(l)) return 'bad'
  if (/github\.com\/advisories/.test(l)) return 'adv'
  return ''
}

function render(running) {
  out.innerHTML = log.map((l) => `<span class="${lineClass(l)}">${esc(l)}</span>`).join('\n') +
    (running ? '\n<span class="dt-cursor">▍</span>' : log.length ? '' : '<span class="dim">Click a button to run the command.</span>')
  out.scrollTop = out.scrollHeight
}

async function api(path, method = 'GET') {
  const res = await fetch('/__demo/' + path, { method, headers: { 'x-demo': '1' } })
  return res.json()
}

async function showVersions() {
  const deps = await api('versions')
  term.querySelector('#dt-vers').textContent = 'package.json: ' + Object.entries(deps).map(([k, v]) => `${k} ${v}`).join(' · ')
}

async function run(id) {
  const [, , cmd] = COMMANDS.find((c) => c[0] === id)
  if (id === 'reset') log = []
  log.push(`$ ${cmd}`)
  buttons.forEach((b) => (b.disabled = true))
  render(true)
  save()
  try {
    const { output } = await api(id, 'POST')
    log.push(...output.split(/\r?\n/), '')
  } catch {
    log.push('Command failed. Is the dev server still running?', '')
  }
  buttons.forEach((b) => (b.disabled = false))
  render(false)
  save()
  showVersions()
}

function setOpen(open) {
  term.hidden = !open
  pill.hidden = open
  if (open) { render(false); showVersions() }
  save()
}

pill.addEventListener('click', () => setOpen(true))
term.querySelector('.dt-x').addEventListener('click', () => setOpen(false))
buttons.forEach((b) => b.addEventListener('click', () => run(b.dataset.cmd)))
window.addEventListener('keydown', (e) => {
  if (e.key === '`' && !e.target.closest?.('input, select, textarea')) setOpen(term.hidden)
})

// Keep the output if Vite reloads the page after packages change.
try {
  const saved = JSON.parse(sessionStorage.getItem('demo-term'))
  if (saved) {
    log = saved.log
    setOpen(saved.open)
  }
} catch {}
