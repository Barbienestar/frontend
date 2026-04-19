import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MapaPage } from "./pages/MapaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mapa" element={<MapaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
