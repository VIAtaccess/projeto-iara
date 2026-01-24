import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './menu.css';


function CardOpcao({ icone, titulo, onClick, imagemExtra }) {
  return (
    <div className="card-item" onClick={onClick}>
      {imagemExtra && <img src={imagemExtra} alt={titulo} className="card-img-extra" />}
      {icone}
      <h6 className="card-titulo">{titulo}</h6>
    </div>
  );
}

function Menu() {
  const navigate = useNavigate();

  
  const [nomeUsuario] = useState(() => {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    return nomeSalvo || 'Visitante'; 
  });

  function voltarLogin() {
    localStorage.clear(); 
    navigate('/login');
  }

  return (
    <div className="menu-container">
      
      <button className="btnVoltar" onClick={voltarLogin}>
        ⬅ Sair
      </button>

      <div className="metadeSuperior">
        <div className="saudacaoContainer">
            <h1 className="textoSaudacao">Olá, <span className="nomeDestaque" style={{textTransform: 'capitalize'}}>{nomeUsuario}</span>!</h1>
            <p className="subtextoSaudacao">Sou a <b>IAra</b>. Como posso te ajudar hoje?</p>
        </div>

        <img src="/img/iara.png" alt="Logo IAra" className="logoIaraMenu" />
      </div>

      <div className="estruturaInferior">
        <div className="grid-cards">
          
          <CardOpcao 
            titulo="Empreender"
            imagemExtra="https://i.ibb.co/n8kWgnmt/Icon-symbolizing-entrepreneurship-and-innovation.png"
            onClick={() => console.log("Ir para Empreender")}
          />

          <CardOpcao 
            titulo="Dicas de Inclusão Digital"
            icone={<i className="fa-regular fa-lightbulb card-icone"></i>}
            onClick={() => console.log("Ir para Dicas")}
          />

          <CardOpcao 
            titulo="Sala de Aula"
            icone={<i className="fa-solid fa-book card-icone"></i>}
            onClick={() => navigate("/sala-de-aula")}
          />

          <CardOpcao 
            titulo="Iniciar uma Conversa"
            icone={
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chat-left-text card-icone-svg" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
              </svg>
            }
            onClick={() => navigate("/chat")}
          />

        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    </div>
  );
}

export default Menu;