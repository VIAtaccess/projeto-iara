import './menu.css';
import { useNavigate } from 'react-router-dom';

function CardChat() {
  const navigate = useNavigate();

  return (
    <div
      className="cardDicas"
      onClick={() => navigate("/chat")}
      style={{ cursor: "pointer" }}
    >
      <img src="/icons/empreender.svg" alt="" />

      <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
</svg>

      <h6 className="textoCardchat">Iniciar uma Conversa</h6>
    </div>
  );
}

function Menu() {
  const navigate = useNavigate();

  function voltarLogin() {
    navigate('/login');
  }

  return (
    <>
      <div className="container">

        {/* BOTÃO VOLTAR */}
        <button className="btnVoltar" onClick={voltarLogin}>
          ⬅ Sair
        </button>

        <div className="metadeSuperior">
          <img
            src="../../../public/img/iara.png"
            alt="LogoIaraMenu"
            className="logoIaraMenu"
          />
        </div>

        <div className="estruturaInferior">

          <div className="cardEmpreender">
            <img src="/icons/empreender.svg" alt="" />
            <img className='imgCardempreender' src="https://i.ibb.co/n8kWgnmt/Icon-symbolizing-entrepreneurship-and-innovation.png" alt="Icon symbolizing entrepreneurship and innovation" border="0"></img>
            <h6 className='textoEmpreender'>Empreender</h6>
            
          </div>


          <div className="cardSala">            
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" ></link>
            <i  class="fa-regular fa-lightbulb" ></i>
            <h6 className="tituloCardSala">Dicas de inclusao Digital</h6>
            <img src="/icons/empreender.svg" alt="" />
          </div>


  <div className="cardPraticas">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"></link>
  <i class="fa-solid fa-book"></i>
  <h6 className='textoSalaAula'>Sala de Aula</h6>
  </div>

  <CardChat />

</div>
      </div>
    </>
  );
}

export default Menu;
