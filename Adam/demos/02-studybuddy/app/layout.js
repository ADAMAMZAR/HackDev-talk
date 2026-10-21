import { Bricolage_Grotesque, Atkinson_Hyperlegible } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--display' })
const body = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--body' })

export const metadata = { title: 'StudyBuddy' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Script src="http://localhost:5100/nav.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
