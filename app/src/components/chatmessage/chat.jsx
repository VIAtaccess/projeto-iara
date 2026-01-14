import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";

function Chat() {
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([
    { texto: "Olá! Como posso te ajudar?", tipo: "recebida" }
  ]);

  const [texto, setTexto] = useState("");
  const fimDoChatRef = useRef(null);

  function enviarMensagem() {
    if (texto.trim() === "") return;

    setMensagens(prev => [
      ...prev,
      { texto, tipo: "enviada" }
    ]);

    setTexto("");

    // resposta simulada
    setTimeout(() => {
      setMensagens(prev => [
        ...prev,
        { texto: "Mensagem recebida!", tipo: "recebida" }
      ]);
    }, 800);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      enviarMensagem();
    }
  }

  // auto-scroll SEMPRE para a última mensagem
  useEffect(() => {
    fimDoChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  return (
    <div className="chat-container">

      <div className="chat-mensagens">
        {mensagens.map((msg, index) => (
          <div key={index} className={`mensagem ${msg.tipo}`}>
            {msg.texto}
          </div>
        ))}

        {/* Âncora de scroll */}
        <div ref={fimDoChatRef}></div>

      </div>
    {/* BOTÃO VOLTAR (ADICIONADO) */}
      <button
        className="btnVoltar"
        onClick={() => navigate("/menu")}
      >
        Voltar
      </button>
      <div>

      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>

    </div>
  );
}

export default Chat;
