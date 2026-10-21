import { useEffect, useState } from 'react'
import { supabase } from './integrations/supabase/client'

export default function App() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (!ready) return null
  return (
    <>
      {session ? <Portal user={session.user} /> : <SignIn />}
      <div className="demo-note">Demo app · fake data</div>
    </>
  )
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">c</span>CampusConnect
    </div>
  )
}

function SignIn() {
  const [email, setEmail] = useState('aina@campus.example')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="signin">
      <section className="signin-art">
        <Brand />
        <h1 className="rise">Find your people <em>on campus.</em></h1>
        <div className="stats rise" style={{ animationDelay: '.1s' }}>
          <div><b>12,400</b>students</div>
          <div><b>38</b>courses</div>
          <div><b>210</b>clubs</div>
        </div>
      </section>

      <section className="signin-form-wrap">
        <form className="signin-form rise" style={{ animationDelay: '.15s' }} onSubmit={submit}>
          <h2>Sign in</h2>
          <p className="muted">Use your student email.</p>

          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <p className="error" role="alert">{error}</p>
        </form>
      </section>
    </div>
  )
}

function Portal({ user }) {
  const [profile, setProfile] = useState() // undefined = loading, null = not found
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = () =>
      supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id) // only show my own profile
        .maybeSingle()
        .then(({ data, error }) => {
          setProfile(data)
          setError(error)
        })
    load()
    window.addEventListener('demo-refresh', load) // the demo panel changed RLS
    return () => window.removeEventListener('demo-refresh', load)
  }, [user.id])

  const name = profile?.full_name.split(' ')[0] ?? user.email.split('@')[0]
  const firstName = name[0].toUpperCase() + name.slice(1)

  return (
    <>
      <header className="topbar">
        <Brand />
        <nav className="nav" aria-label="Main">
          <span className="active">My profile</span>
          <span>Courses</span>
          <span>Timetable</span>
          <span>Clubs</span>
        </nav>
        <div className="who">
          <span className="muted">{user.email}</span>
          <button className="link-btn" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </header>

      <main className="portal">
        <section className="greeting rise">
          <div className="eyebrow">Semester 1 · 2026/2027</div>
          <h1>Selamat datang, <em>{firstName}</em>.</h1>
        </section>

        <section className="rise" style={{ animationDelay: '.08s' }}>
          {profile === undefined ? (
            <div className="idcard skeleton" aria-label="Loading profile" />
          ) : profile ? (
            <IdCard p={profile} />
          ) : (
            <div className="empty">
              <h3>We couldn't find your profile</h3>
              <p className="muted">Your student record didn't load. Try again later or contact the registrar.</p>
              {error && <code className="err-code">{error.message}</code>}
            </div>
          )}
        </section>

        <aside className="side rise" style={{ animationDelay: '.16s' }}>
          <div className="privacy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <p><b>Your profile is private.</b> Only you can see your details.</p>
          </div>

          <div className="panel">
            <h4>Announcements</h4>
            <ul className="news">
              <li><time>25 Oct</time><p>HackDev talk: Vibe Coding Safely</p></li>
              <li><time>31 Oct</time><p>Add/drop period closes at 5pm</p></li>
              <li><time>3 Nov</time><p>Library extends opening hours for finals</p></li>
            </ul>
          </div>
        </aside>
      </main>
    </>
  )
}

function IdCard({ p }) {
  const initials = p.full_name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('')

  return (
    <article className="idcard">
      <div className="idcard-head">
        <span>Student ID</span>
        <span>Valid 2026/27</span>
      </div>
      <div className="idcard-body">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <div>
          <h3>{p.full_name}</h3>
          <div className="matric">{p.matric_no}</div>
          <dl className="fields">
            <div><dt>Course</dt><dd>{p.course}</dd></div>
            <div><dt>Year</dt><dd>Year {p.year}</dd></div>
            <div><dt>Email</dt><dd>{p.email}</dd></div>
            <div><dt>Phone</dt><dd>{p.phone}</dd></div>
            <div className="span-2"><dt>Hostel</dt><dd>{p.hostel}</dd></div>
          </dl>
        </div>
      </div>
    </article>
  )
}
