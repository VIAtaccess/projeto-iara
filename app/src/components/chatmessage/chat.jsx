import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

/**
 * ⚠️ NOTA PARA O SEU PROJETO REAL:
 * No seu computador/GitHub, você deve restaurar os imports:
 * import api from "../../services/api";
 * import "./chat.css";
 */

// Simulação da API para que o Preview funcione sem erros
const apiMock = {
  get: async (url) => {
    console.log(`Simulando busca em: ${url}`);
    return { data: [] }; 
  },
  post: async (url, data) => {
    console.log(`Simulando envio para ${url}:`, data);
    return { 
      data: { 
        resposta: "Oi! Já ajustei tudo. Agora o fundo está branquinho, as letras estão roxas e bem legíveis, e o botão de voltar apareceu de novo no topo! Como posso te ajudar? 🛶✨" 
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
        const response = await apiMock.get("/iara/chat/historico");
        const listaBackend = response.data;
        const mensagensFormatadas = listaBackend.map((msg) => ({
          texto: msg.texto,
          tipo: msg.quemEnviou === "usuario" ? "enviada" : "recebida"
        }));
        setMensagens(mensagensFormatadas);
      } catch (error) {
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
      <div className="w-full max-w-2xl h-[100dvh] sm:h-[90dvh] flex flex-col bg-white sm:rounded-[30px] overflow-hidden shadow-2xl border-none sm:border sm:border-slate-200">
        
        {/* Header Escuro (Roxo) para dar destaque ao botão Voltar e Avatar */}
        <div className="p-4 bg-[#1a0b2e] flex items-center justify-between shrink-0 shadow-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-400 overflow-hidden border-2 border-white shadow-sm">
               <img src="https://api.dicebear.com/7.x/bottts/svg?seed=IAra" alt="IAra" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">IAra</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] sm:text-xs text-cyan-300 font-medium">Online e Aprendendo</span>
              </div>
            </div>
          </div>
          <button 
            className="px-4 py-1.5 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white rounded-full text-xs sm:text-sm font-bold transition-all"
            onClick={() => window.history.back()}
          >
            ← Voltar
          </button>
        </div>

        {/* Área das Mensagens - Fundo Branco, Letras Roxas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white scrollbar-thin scrollbar-thumb-slate-200">
          {mensagens.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in duration-700">
               <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cyan-400 overflow-hidden border-4 border-[#2d1b4e] shadow-xl">
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=IAra" alt="IAra" className="w-full h-full object-cover" />
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
              <div className={`max-w-[85%] p-5 rounded-[22px] shadow-sm text-sm leading-relaxed transition-all duration-300 ${
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

        {/* Rodapé Ajustado - Campo com Letras Escuras e Botão Visível */}
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
              autoComplete="off"
            />
            <button 
              className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center shadow-md ${
                texto.trim() && !carregando 
                ? "bg-[#2d1b4e] hover:bg-[#3b2269] text-white active:scale-95 shadow-purple-200" 
                : "bg-slate-300 text-slate-100 cursor-not-allowed"
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
