import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastro from './pages/cadastro';
import Login from './pages/login';
import Lista from './pages/lista';
import Carros from './pages/Carros';
import Landing from './pages/Landing';
import Adm from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Cadastro" element={<Cadastro />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Lista" element={<Lista />} />
      <Route path="/Carros" element={<Carros />} />
      <Route path="/Adm" element={<Adm />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
