import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MapaPage } from './pages/MapaPage'
import Access from './pages/access'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mapa" element={<MapaPage />} />
        <Route path="/access" element={<Access />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
