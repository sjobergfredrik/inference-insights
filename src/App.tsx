import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/layout/Layout.tsx'
import { LandingPage } from './pages/LandingPage.tsx'
import { TokenPage } from './components/tokens/TokenPage.tsx'
import { VectorPage } from './components/vectors/VectorPage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="tokens" element={<TokenPage />} />
          <Route path="vectors" element={<VectorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
