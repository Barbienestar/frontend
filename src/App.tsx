import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Access from './pages/access';
import { Admin } from './pages/admin';
import Dashboard from './pages/dashboard';
import ForbiddenPage from './pages/forbidden';
import Inicio from './pages/inicio';
import MapaDeAbasto from './pages/mapaDeAbasto';
import MyReports from './pages/myReports';
import ReportarPage from './pages/report';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
