import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Access from './pages/access';
import ForbiddenPage from './pages/forbidden';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/access" element={<Access />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
