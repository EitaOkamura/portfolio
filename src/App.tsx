import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { WorkDetail } from './pages/WorkDetail'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="works/:workId" element={<WorkDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
