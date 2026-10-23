// Shared top navbar for every demo. Hidden until the mouse touches the top edge of the page.
// Served by run-all.mjs at http://localhost:5100/nav.js and loaded by each demo page.

const DEMOS = [
  ['1', 'LeadSnap', 'http://localhost:5101/'],
  ['2', 'StudyBuddy', 'http://localhost:5102/'],
  ['2', 'Fixed', 'http://localhost:5102/fixed'],
  ['3', 'CampusConnect', 'http://localhost:5103/'],
  ['4A', 'MCP plug-in', 'http://localhost:5100/04a-mcp-plugin/'],
  ['4B', 'KedaiKita', 'http://localhost:5104/'],
  ['4C', 'Agent', 'http://localhost:5100/04c-agent-console/'],
  ['5', 'KopiCheck', 'http://localhost:5100/05-kopicheck/'],
]

const here = location.origin + location.pathname
const host = document.createElement('demo-nav')
// Shadow DOM keeps each demo's own CSS from touching the navbar, and the other way round.
host.attachShadow({ mode: 'open' }).innerHTML = `
  <style>
    :host { position: fixed; top: 0; left: 0; right: 0; z-index: 2147483000; font: 500 13px system-ui, sans-serif; }
    .zone { height: 6px; }
    nav {
      position: absolute; top: 0; left: 0; right: 0;
      display: flex; align-items: center; gap: 4px;
      padding: 8px 14px;
      overflow-x: auto;
      background: rgba(17, 18, 22, .94); color: #e8e8e3;
      border-bottom: 1px solid #2c2f37;
      box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
      transform: translateY(-100%);
      transition: transform .18s ease .3s;
    }
    .zone:hover + nav, nav:hover, nav:focus-within { transform: none; transition-delay: 0s; }
    b { margin-right: 10px; font: 600 11px ui-monospace, monospace; letter-spacing: .1em; color: #8b8f99; white-space: nowrap; }
    a { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; color: inherit; text-decoration: none; white-space: nowrap; }
    a:hover { background: #262a32; }
    a[aria-current] { background: #e8e8e3; color: #16181d; }
    a i { font: 700 11px ui-monospace, monospace; font-style: normal; opacity: .55; }
    a:focus-visible { outline: 2px solid #ffb000; outline-offset: 1px; }
    @media (prefers-reduced-motion: reduce) { nav { transition: none; } }
  </style>
  <div class="zone"></div>
  <nav aria-label="Demos">
    <b>VIBE CODING SAFELY</b>
    ${DEMOS.map(([n, label, url]) => `<a href="${url}"${url === here ? ' aria-current="page"' : ''}><i>${n}</i>${label}</a>`).join('')}
  </nav>`
document.body.append(host)
