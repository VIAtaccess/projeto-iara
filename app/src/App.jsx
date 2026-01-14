import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/login/login';
import Telainicio from './components/telainicio/telainicio';
import Menu from './components/menu/menu';
import Chat from './components/chatmessage/chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Telainicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
