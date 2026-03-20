import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

// Simulação do serviço de API para evitar erros de importação externa
const api = {
  get: async (url) => {
    // Simulação de busca de histórico
    console.log(`Buscando: ${url}`);
    return { data: [] }; 
  },
  post: async (url, data) => {
    // Simulação de envio
    console.log(`Enviando para ${url}:`, data);
    return { data: { resposta: "Olá! Como posso ajudar você hoje?" } };
  }
};

const IconeEnviar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function App() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimDoChatRef = useRef(null);

  // Lógica para carregar histórico
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
        if (error.response?.status === 401) {
          setMensagens([{ 
            texto: "⚠️ Sua sessão expirou por segurança. Por favor, saia e entre novamente para ver seu histórico! ✨", 
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
      const response = await api.post("/iara/chat/enviar", { mensagem: mensagemUsuario });
      const respostaIA = response.data.resposta;

      setMensagens((prev) => [...prev, { texto: respostaIA, tipo: "recebida" }]);
    
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      
      let msgErro = "Erro de conexão. A IAra está dormindo 😴";
      
      if (error.response?.status === 401) {
        msgErro = "⚠️ Sua sessão expirou por segurança. Por favor, volte ao menu e faça login novamente para continuarmos! 🥰";
      }

      setMensagens((prev) => [
        ...prev, 
        { texto: msgErro, tipo: "recebida" }
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
    /* Ajuste Principal: Usando min-h-[100dvh] para evitar que o layout 
       seja cortado pela barra de endereços do celular (iOS/Android).
    */
    <div className="min-h-[100dvh] bg-[#2d1b4e] flex items-center justify-center p-0 sm:p-4 font-sans text-white overflow-hidden">
      
      {/* O container do chat agora ocupa a altura dinâmica máxima disponível.
      */}
      <div className="w-full max-w-2xl h-[100dvh] sm:h-[90dvh] flex flex-col bg-[#1a0b2e] sm:rounded-3xl overflow-hidden shadow-2xl border-none sm:border sm:border-purple-500/30">
        
        {/* Header - Mantendo fixo no topo */}
        <div className="p-4 bg-[#251442] border-b border-purple-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-400 overflow-hidden border-2 border-purple-300">
               <img src="https://api.dicebear.com/7.x/bottts/svg?seed=IAra" alt="Avatar IAra" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">IAra</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] sm:text-xs text-purple-200">Online e Aprendendo</span>
              </div>
            </div>
          </div>
          <button 
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-700 hover:bg-purple-600 rounded-xl transition-all text-xs sm:text-sm font-medium"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>

        {/* Chat Body - Área de rolagem */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500">
          {mensagens.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-50 text-center space-y-2">
               <p className="text-2xl">🛶</p>
               <p className="text-sm">Nenhuma mensagem ainda.<br/>Dê um "Oi" para a IAra!</p>
            </div>
          )}

          {mensagens.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.tipo === "enviada" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                msg.tipo === "enviada" 
                ? "bg-orange-500 text-white rounded-tr-none" 
                : "bg-[#361e5a] text-purple-50 rounded-tl-none border border-purple-400/20"
              }`}>
                <ReactMarkdown className="prose prose-invert max-w-none text-sm leading-relaxed">
                  {msg.texto}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {carregando && (
            <div className="flex justify-start">
              <div className="bg-[#361e5a] p-3 rounded-2xl rounded-tl-none animate-pulse text-[10px] text-purple-200">
                IAra está digitando...
              </div>
            </div>
          )}

          <div ref={fimDoChatRef}></div>
        </div>

        {/* Footer / Input - Reforçado com padding extra embaixo (pb-10) 
            para garantir que os botões não fiquem escondidos pela barra do celular.
        */}
        <div className="p-4 bg-[#251442] border-t border-purple-500/20 pb-10 sm:pb-6">
          <div className="relative flex items-center gap-2 bg-[#1a0b2e] rounded-2xl p-1.5 border border-purple-500/30 focus-within:border-purple-400 transition-all shadow-inner">
            <input
              className="flex-1 bg-transparent border-none outline-none p-3 text-sm placeholder-purple-300/50"
              type="text"
              placeholder={carregando ? "Aguarde..." : "Digite sua dúvida..."}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={carregando}
            />
            <button 
              className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                texto.trim() && !carregando 
                ? "bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20" 
                : "bg-gray-700 opacity-50 cursor-not-allowed"
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
