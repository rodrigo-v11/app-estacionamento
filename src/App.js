import{ BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from 'react-router-dom';
import Cadastro from './pages/cadastro';
import Login from './pages/login';
import Lista from './pages/lista';
import Carros from './pages/Carros';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Cadastro />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Lista" element={<Lista />} />
      <Route path="/Carros" element={<Carros />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
