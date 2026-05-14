import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Access from './pages/access';
import { Admin } from './pages/admin';
import Dashboard from './pages/dashboard';
import ForbiddenPage from './pages/forbidden';
import Inicio from './pages/inicio';
import MapaDeAbasto from './pages/mapaDeAbasto';
import MyReports from './pages/myReports';
import ReportarPage from './pages/report';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        {/* Rutas públicas */}
        <Route path="/access" element={<Access />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/mapa-de-abasto" element={<MapaDeAbasto />} />

        {/* Rutas privadas */}
        <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
          <Route path="/reportar" element={<ReportarPage />} />
          <Route path="/mis-reportes" element={<MyReports />} />
        </Route>

        {/* Rutas privadas admin*/}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/*  Rutas privadas health*/}
        <Route element={<ProtectedRoute allowedRoles={['health']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;