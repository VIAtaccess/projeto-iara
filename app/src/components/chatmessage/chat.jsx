import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

/**
 * NOTA PARA O PROJETO REAL: 
 * No seu computador/GitHub, você deve usar:
 * import api from "../../services/api";
 * import "./chat.css";
 */
const api = {
  get: async (url) => {
    console.log(`Buscando histórico real em: ${url}`);
    return { data: [] }; 
  },
  post: async (url, data) => {
    console.log(`Enviando mensagem para ${url}:`, data);
    return { 
      data: { 
        resposta: "Oi! Agora ajustei o campo para ficar bem clarinho e o texto bem escuro. Assim você consegue ler tudo o que digita sem esforço! Como posso te ajudar agora? 🛶✨" 
      } 
    };
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
        if (error.response?.status === 401) {
          setMensagens([{ 
            texto: "⚠️ Sua sessão expirou. Por favor, clique em 'Voltar' e entre novamente! ✨", 
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
      let msgErro = "Erro de conexão. A IAra está dormindo 😴";
      if (error.response?.status === 401) {
        msgErro = "⚠️ Sessão expirada. Por favor, faça login novamente! 🥰";
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
    <div className="min-h-[100dvh] bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      
      {/* Janela Principal do Chat - FUNDO BRANCO */}
      <div className="w-[95%] max-w-2xl h-[95dvh] sm:h-[90dvh] flex flex-col bg-white sm:rounded-[30px] overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header - Roxo com Branco */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cyan-400 overflow-hidden border-2 border-[#2d1b4e] shadow-lg">
               <img src="/img/iara.png" alt="IAra" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2d1b4e]">IAra</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-500 font-medium">● Online e Aprendendo</span>
              </div>
            </div>
          </div>
          <button 
            className="px-6 py-2 bg-[#2d1b4e] hover:bg-[#3b2269] text-white rounded-full transition-all text-sm font-bold shadow-md"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>

        {/* Área das Mensagens - Fundo Branco, Letras Roxas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
          {mensagens.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in duration-700">
               <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cyan-400 overflow-hidden border-4 border-[#2d1b4e] shadow-2xl">
                  <img src="/img/iara.png" alt="IAra" className="w-full h-full object-cover" />
               </div>
               <div className="space-y-3">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2d1b4e] leading-tight">
                    Olá, <span className="text-cyan-600">Tarciana</span>!
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-lg max-w-xs mx-auto leading-relaxed">
                    Sou a <span className="font-bold text-[#2d1b4e]">IAra</span>. Como posso te ajudar hoje? 🛶
                  </p>
               </div>
            </div>
          )}

          {mensagens.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.tipo === "enviada" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-5 rounded-[25px] shadow-sm text-sm leading-relaxed transition-all duration-300 ${
                msg.tipo === "enviada" 
                ? "bg-[#ef7d00] text-white rounded-tr-none shadow-orange-100" 
                : "bg-purple-50 text-[#2d1b4e] rounded-tl-none border border-purple-100"
              }`}>
                <ReactMarkdown className={`prose max-w-none text-sm leading-relaxed ${msg.tipo === "recebida" ? "prose-slate" : "prose-invert"}`}>
                  {msg.texto}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {carregando && (
            <div className="flex justify-start">
              <div className="bg-purple-50 px-4 py-2 rounded-full animate-pulse text-[10px] text-[#2d1b4e] uppercase tracking-widest font-bold border border-purple-100">
                IAra está digitando...
              </div>
            </div>
          )}

          <div ref={fimDoChatRef}></div>
        </div>

        {/* Rodapé - Ajustado para melhor visibilidade e contraste */}
        <div className="p-4 bg-white border-t border-slate-100 pb-12 sm:pb-6">
          <div className="w-full flex items-center gap-3 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-[#2d1b4e] focus-within:ring-1 focus-within:ring-purple-100 transition-all shadow-inner">
            <input
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-base text-slate-900 placeholder-slate-400 font-medium"
              type="text"
              placeholder={carregando ? "IAra está pensando..." : "Digite sua dúvida aqui..."}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={carregando}
            />
            <button 
              className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center shadow-md ${
                texto.trim() && !carregando 
                ? "bg-[#2d1b4e] hover:bg-[#3b2269] text-white active:scale-95" 
                : "bg-slate-300 cursor-not-allowed text-slate-100"
              }`}
              onClick={enviarMensagem} 
              disabled={carregando || !texto.trim()}
              title="Enviar mensagem"
            >
              <IconeEnviar />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
