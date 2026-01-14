import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/login/login';
import Telainicio from './components/telainicio/telainicio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Telainicio />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
