import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Access from './pages/access';
import ForbiddenPage from './pages/forbidden';
import Report from './pages/report';
import MyReports from './pages/myReports';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/access" element={<Access />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/report" element={<Report />} />
        <Route path="/mis-reportes" element={<MyReports />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
