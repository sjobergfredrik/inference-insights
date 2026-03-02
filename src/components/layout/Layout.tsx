import { Outlet } from 'react-router'
import { Header } from './Header.tsx'
import { Footer } from './Footer.tsx'

export function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}
