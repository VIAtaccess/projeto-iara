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
    <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* Container Principal Branco */}
      <div className="w-full max-w-2xl h-[100dvh] sm:h-[90dvh] flex flex-col bg-white sm:rounded-3xl overflow-hidden shadow-xl border-none sm:border sm:border-slate-200">
        
        {/* Header Claro */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-100 overflow-hidden border-2 border-cyan-400 shadow-sm">
               <img src="/img/iara.png" alt="Avatar IAra" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">IAra</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Online e Aprendendo</span>
              </div>
            </div>
          </div>
          <button 
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all text-xs sm:text-sm font-medium shadow-md"
            onClick={() => window.history.back()}
          >
            ← Sair
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* Tela de Boas-vindas organizada para Fundo Claro */}
          {mensagens.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cyan-400 overflow-hidden border-4 border-white shadow-2xl">
                     <img src="/img/iara.png" alt="IAra" className="w-full h-full object-cover" />
                  </div>
               </div>
               
               <div className="space-y-3">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
                    Olá, <span className="text-cyan-600">Tarciana</span>!
                  </h1>
                  <p className="text-slate-500 text-sm sm:text-lg max-w-xs mx-auto leading-relaxed">
                    Sou a <span className="font-bold text-slate-700">IAra</span>. Como posso te ajudar com seu negócio hoje? 🛶
                  </p>
               </div>
            </div>
          )}

          {mensagens.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.tipo === "enviada" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm transition-all duration-300 ${
                msg.tipo === "enviada" 
                ? "bg-orange-500 text-white rounded-tr-none shadow-orange-200" 
                : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
              }`}>
                <ReactMarkdown className="prose prose-slate max-w-none text-sm leading-relaxed">
                  {msg.texto}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {carregando && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-none animate-pulse text-[10px] text-slate-400 font-medium">
                IAra está digitando...
              </div>
            </div>
          )}

          <div ref={fimDoChatRef}></div>
        </div>

        {/* Footer / Input Claro */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 pb-10 sm:pb-6">
          <div className="relative flex items-center gap-2 bg-white rounded-2xl p-1.5 border border-slate-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100 transition-all shadow-sm">
            <input
              className="flex-1 bg-transparent border-none outline-none p-3 text-sm text-slate-800 placeholder-slate-400"
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
                ? "bg-cyan-500 hover:bg-cyan-600 shadow-md shadow-cyan-200" 
                : "bg-slate-200 opacity-50 cursor-not-allowed"
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
