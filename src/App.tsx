import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Access from './pages/access';
import ForbiddenPage from './pages/forbidden';
import MapaDeAbasto from './pages/mapaDeAbasto';
import ReportarPage from './pages/report';
import Inicio from './pages/inicio';
import MyReports from './pages/myReports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/access" element={<Access />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/mapa-de-abasto" element={<MapaDeAbasto />} />
        <Route path="/reportar" element={<ReportarPage />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/mis-reportes" element={<MyReports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
