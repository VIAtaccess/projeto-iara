import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import api from "../../services/api"; 
import "./chat.css"; 


const IconeEnviar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Chat() {
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimDoChatRef = useRef(null);

  
  useEffect(() => {
    async function carregarHistorico() {
      try {
        const response = await api.get("/iara/chat/historico");
        const listaBackend = response.data;

        const mensagensFormatadas = listaBackend.map((msg) => ({
          texto: msg.texto,
          tipo: msg.quemEnviou === "usuario" ? "enviada" : "recebida"
        }));

        setMensagens(mensagensFormatadas);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    }
    carregarHistorico();
  }, []);

  
  async function enviarMensagem() {
    if (texto.trim() === "" || carregando) return;

    const mensagemUsuario = texto;
    setTexto("");
    setCarregando(true);

   
    setMensagens((prev) => [...prev, { texto: mensagemUsuario, tipo: "enviada" }]);

    try {
      const response = await api.post("/iara/chat/enviar", { mensagem: mensagemUsuario });
      const respostaIA = response.data.resposta;

      setMensagens((prev) => [...prev, { texto: respostaIA, tipo: "recebida" }]);
    
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMensagens((prev) => [
        ...prev, 
        { texto: "Erro de conexão. A IAra está dormindo 😴", tipo: "recebida" }
      ]);
    } finally {
      setCarregando(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  }

  useEffect(() => {
    fimDoChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  return (
    <div className="chat-page-container">
      <div className="chat-window">
        
        
        <div className="chat-header">
          <div className="header-info">
            
            <img src="/img/iara.png" alt="Avatar IAra" className="avatar-iara" />
            <div className="chat-title">
              <h2>IAra</h2>
              <span className="status-dot">● Online e Aprendendo</span>
            </div>
          </div>
          
          <button className="btn-header-voltar" onClick={() => navigate("/menu")}>
            Voltar
          </button>
        </div>

        <div className="chat-body">
          {mensagens.length === 0 && (
             <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '50px'}}>
                <p>Nenhuma mensagem ainda.<br/>Comece dando um "Oi"!</p>
             </div>
          )}


          {mensagens.map((msg, index) => (
            <div key={index} className={`mensagem ${msg.tipo}`}>
              <ReactMarkdown>{msg.texto}</ReactMarkdown>
            </div>
          ))}

          {carregando && (
            <div className="msg-status-digitando">
              IAra está digitando...
            </div>
          )}

          <div ref={fimDoChatRef}></div>
        </div>

        
        <div className="chat-footer">
          <div className="input-group">
            <input
              className="chat-input-field"
              type="text"
              placeholder={carregando ? "Aguarde..." : "Digite sua dúvida..."}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={carregando}
            />
            <button 
              className="btn-enviar" 
              onClick={enviarMensagem} 
              disabled={carregando}
            >
              <IconeEnviar />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;