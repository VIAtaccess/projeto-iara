import './telaincio.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Telainicio() {
  const navigate = useNavigate();
  const [comecando, setComecando] = useState(false);
  const [saindo, setSaindo] = useState(false); // 👈 controla animação

  function irParaLogin() {
    setComecando(true);
    setSaindo(true); // inicia fade-out

    setTimeout(() => {
      navigate('/login');
    }, 1000); // tempo da animação
  }

  return (
    <div className={`indexContainer ${saindo ? 'fade-out' : ''}`}>
      <div className="conteudoindex">

        <h1 className="tituloindex">IAra</h1>

        <img src="/img/iara.png" alt="logoiara" className="logoiaraindex" />

        <button
          className="btnEntrar"
          onClick={irParaLogin}
          disabled={comecando}
        >
          {comecando ? 'Começando...' : 'Entrar'}
        </button>

        <img
          src="/img/anjos.png"
          alt="anjosdigitais"
          className="anjosDigitais1"
        />
      </div>
    </div>
  );
}

export default Telainicio;
