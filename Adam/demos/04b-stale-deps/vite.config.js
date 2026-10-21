import { defineConfig } from 'vite'
import { exec } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Endpoints for the Demo terminal (demo-panel.js): run fixed npm/git commands
// so the audit demo needs no terminal window. Nothing from the request reaches the shell.
const COMMANDS = {
  audit: 'npm audit',
  update: 'npm install axios@latest lodash@latest',
  // npm install, not npm ci: ci deletes node_modules, including the running Vite.
  reset: 'git checkout -- package.json package-lock.json && npm install',
}

function demoCommands() {
  return {
    name: 'demo-commands',
    configureServer(server) {
      const root = server.config.root
      server.middlewares.use('/__demo', (req, res) => {
        // A custom header means browsers won't let other websites call this.
        if (req.headers['x-demo'] !== '1') {
          res.statusCode = 403
          return res.end()
        }
        res.setHeader('Content-Type', 'application/json')
        const name = req.url.slice(1)
        if (name === 'versions') {
          return res.end(JSON.stringify(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).dependencies))
        }
        const cmd = COMMANDS[name]
        if (!cmd || req.method !== 'POST') {
          res.statusCode = 404
          return res.end()
        }
        exec(cmd, { cwd: root, timeout: 180_000, maxBuffer: 10_000_000 }, (_err, stdout, stderr) => {
          res.end(JSON.stringify({ output: (stdout + stderr).trim() }))
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [demoCommands()],
  server: { port: 5104, strictPort: true },
})
