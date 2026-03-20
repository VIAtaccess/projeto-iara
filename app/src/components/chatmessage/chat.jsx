import React, { useState, useEffect, useRef } from "react";
import { useNavigate, HashRouter, Routes, Route } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

/**
 * ⚠️ NOTA PARA O SEU PROJETO REAL:
 * No seu computador/GitHub, você deve restaurar os imports originais:
 * import api from "../../services/api";
 * import "./chat.css";
 */

// Simulação da API para que o Preview funcione sem erros no Canvas
const apiMock = {
  get: async (url) => {
    console.log(`Simulando busca em: ${url}`);
    // Retorna um array vazio para simular histórico limpo na prévia
    return { data: [] }; 
  },
  post: async (url, data) => {
    console.log(`Simulando envio para ${url}:`, data);
    // Simulação de resposta da IAra para teste na prévia
    return { 
      data: { 
        resposta: "Ah, que pergunta boa! Abrir um MEI é como ter um barquinho só seu pra navegar nos negócios, mas com a segurança de um porto. Como posso te ajudar hoje? 🛶✨" 
      } 
    };
  }
};

const IconeEnviar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="#1a0b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#1a0b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Componente de conteúdo do Chat
function ChatContent() {
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimDoChatRef = useRef(null);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const response = await apiMock.get("/iara/chat/historico");
        const listaBackend = response.data;
        const mensagensFormatadas = listaBackend.map((msg) => ({
          texto: msg.texto,
          tipo: msg.quemEnviou === "usuario" ? "enviada" : "recebida"
        }));
        setMensagens(mensagensFormatadas);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        if (error.response?.status === 401) {
          setMensagens([{ 
            texto: "⚠️ Sua sessão expirou. Por favor, volte ao menu e entre novamente! ✨", 
            tipo: "recebida" 
          }]);
        }
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
      const response = await apiMock.post("/iara/chat/enviar", { mensagem: mensagemUsuario });
      const respostaIA = response.data.resposta;
      setMensagens((prev) => [...prev, { texto: respostaIA, tipo: "recebida" }]);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      let msgErro = "A IAra está descansando um pouco. Tente de novo! 😴";
      if (error.response?.status === 401) {
        msgErro = "⚠️ Sessão expirada. Faça login novamente! 🥰";
      }
      setMensagens((prev) => [...prev, { texto: msgErro, tipo: "recebida" }]);
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
    <div className="min-h-[100dvh] bg-[#2d1b4e] flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      
      {/* Janela Principal do Chat */}
      <div className="w-[95%] max-w-2xl h-[95dvh] sm:h-[90dvh] flex flex-col bg-[#1a0b2e] rounded-[30px] overflow-hidden shadow-2xl border border-purple-500/20">
        
        {/* Header - Identidade IAra */}
        <div className="p-4 bg-[#1a0b2e] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cyan-400 overflow-hidden border-2 border-white shadow-lg">
               <img 
                 src="/img/iara.png" 
                 alt="IAra" 
                 className="w-full h-full object-cover" 
                 onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=IAra"; }}
               />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">IAra</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-cyan-300 font-medium">● Online e Aprendendo</span>
              </div>
            </div>
          </div>
          <button 
            className="px-6 py-2 bg-transparent hover:bg-white/10 rounded-full transition-all text-sm font-bold border-2 border-white/40 text-white"
            onClick={() => navigate("/menu")}
          >
            Voltar
          </button>
        </div>

        {/* Corpo do Chat - Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
          {mensagens.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in duration-700">
               <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cyan-400 overflow-hidden border-4 border-white shadow-2xl">
                  <img src="/img/iara.png" alt="IAra" className="w-full h-full object-cover" />
               </div>
               <div className="space-y-3">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                    Olá, <span className="text-cyan-400">Tarciana</span>!
                  </h1>
                  <p className="text-purple-200 text-sm sm:text-lg max-w-xs mx-auto leading-relaxed">
                    Sou a <span className="font-bold text-white">IAra</span>. Como posso te ajudar hoje? 🛶
                  </p>
               </div>
            </div>
          )}

          {mensagens.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.tipo === "enviada" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-5 rounded-[25px] shadow-md text-sm leading-relaxed ${
                msg.tipo === "enviada" 
                ? "bg-[#ef7d00] text-white rounded-tr-none" 
                : "bg-[#3b2269] text-purple-50 rounded-tl-none border border-purple-400/10"
              }`}>
                <ReactMarkdown className="prose prose-invert max-w-none">
                  {msg.texto}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {carregando && (
            <div className="flex justify-start">
              <div className="bg-[#3b2269] px-4 py-2 rounded-full animate-pulse text-[10px] text-purple-200 uppercase tracking-widest font-bold border border-purple-400/10">
                IAra está digitando...
              </div>
            </div>
          )}

          <div ref={fimDoChatRef}></div>
        </div>

        {/* Rodapé - Correção do campo e contraste */}
        <div className="p-4 bg-[#1a0b2e] pb-12 sm:pb-6">
          <div className="flex items-center gap-3 bg-[#e0e0e0] rounded-full p-1.5 shadow-inner">
            <input
              className="flex-1 bg-transparent border-none outline-none px-5 py-3 text-base text-[#1a0b2e] placeholder-[#666] font-medium"
              type="text"
              style={{ color: '#1a0b2e' }}
              placeholder={carregando ? "Aguarde..." : "Digite sua dúvida..."}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={carregando}
            />
            <button 
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${
                texto.trim() && !carregando 
                ? "bg-[#00ffff] hover:scale-105 shadow-lg shadow-cyan-500/20" 
                : "bg-gray-400 opacity-30 cursor-not-allowed"
              }`}
              onClick={enviarMensagem} 
              disabled={carregando || !texto.trim()}
            >
              <IconeEnviar />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Exportação padrão com HashRouter para funcionar no ambiente de prévia
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<ChatContent />} />
      </Routes>
    </HashRouter>
  );
}
