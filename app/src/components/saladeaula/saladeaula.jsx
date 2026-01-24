import React from 'react';
import { useNavigate } from 'react-router-dom';
import './saladeaula.css';

function SalaDeAula() {
  const navigate = useNavigate();

  
  const cursos = [
    { id: 1, titulo: "Primeiros Passos no Digital", nivel: "Iniciante", progresso: 100, cor: "#FFD700", icone: "🌻" },
    { id: 2, titulo: "Vendendo no WhatsApp", nivel: "Intermediário", progresso: 45, cor: "#25D366", icone: "📱" },
    { id: 3, titulo: "Instagram para Negócios", nivel: "Avançado", progresso: 10, cor: "#C13584", icone: "📸" },
    { id: 4, titulo: "Segurança na Internet", nivel: "Essencial", progresso: 0, cor: "#2A52BE", icone: "🛡️" },
    { id: 5, titulo: "Criando Artes no Canva", nivel: "Criativo", progresso: 0, cor: "#00C4CC", icone: "🎨" },
    { id: 6, titulo: "Controle Financeiro Simples", nivel: "Básico", progresso: 0, cor: "#85bb65", icone: "💰" }
  ];

  return (
    <div className="sala-container">
      
      
      <div className="sala-header">
        <div className="titulo-area">
            <h1>Minha Sala de Aula</h1>
            <p>Continue aprendendo e evoluindo, Maria!</p>
        </div>
        <button className="btn-voltar-sala" onClick={() => navigate('/menu')}>
          Voltar
        </button>
      </div>

      
      <div className="grid-cursos">
        {cursos.map((curso) => (
          <div key={curso.id} className="card-curso">
            
            
            <div className="capa-curso" style={{backgroundColor: curso.cor + '40'}}>
                <span className="emoji-curso">{curso.icone}</span>
                <span className="badge-nivel">{curso.nivel}</span>
            </div>

            <div className="corpo-card">
                <h3>{curso.titulo}</h3>
                
                
                <div className="progresso-container">
                    <div className="barra-fundo">
                        <div 
                            className="barra-cheia" 
                            style={{width: `${curso.progresso}%`, backgroundColor: curso.progresso === 100 ? '#00E676' : 'aqua'}}
                        ></div>
                    </div>
                    <span className="texto-progresso">
                        {curso.progresso === 100 ? 'Concluído! 🎉' : `${curso.progresso}%`}
                    </span>
                </div>

                <button className="btn-acessar">
                    {curso.progresso === 0 ? 'Começar' : 'Continuar'}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalaDeAula;