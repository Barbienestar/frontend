import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Access from './pages/access';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/access" element={<Access />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
