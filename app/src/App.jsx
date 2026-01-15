import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/login/login';
import Telainicio from './components/telainicio/telainicio';
import Menu from './components/menu/menu';
import Chat from './components/chatmessage/chat';
import Cadastro from './components/cadastro/cadastro';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Telainicio />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <ToastContainer autoClose={3000} position="top-center" theme="dark" />
    
    </BrowserRouter>
  );
}

export default App;
