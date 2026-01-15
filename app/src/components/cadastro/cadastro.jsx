import './cadastro.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify'; 
function Cadastro() {
  const [visivel, setVisivel] = useState(false);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      
      await api.post('/iara/cadastro', { 
        nome,
        email,
        senha
      });

      
      toast.success('Cadastro realizado! Faça login para continuar.');
      
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      
      
      const mensagemErro = error.response?.data?.erro || 'Erro ao realizar cadastro.';
      toast.error(mensagemErro);
    }
  }

  return (
    <div className={`cadastroContainer ${visivel ? 'fade-in' : ''}`}>

      <div className="titulosCadastro">
        <h1 className="titleCrie">Crie</h1>
        <h1 className="titleSuaConta">Sua Conta</h1>
        <h1 className="titleiaraCadastro">
          <i id="aIARACadastro">na</i> IAra
        </h1>
      </div> 

      <img src="/img/iara.png" alt="iara" className="logoiaraCadastro" />

      <form className="formCadastro" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          className="inputCadastro"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="inputCadastro"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="inputCadastro"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" className="btnCadastro">
          CADASTRAR
        </button>

        <p className="linkLogin" onClick={() => navigate('/')}>
            Já tem conta? <b>Faça Login</b>
        </p>
      </form>

      <img src="/img/anjos.png" alt="anjosDigitais" className="anjosDigitaisCadastro" /> 

    </div>
  );
}

export default Cadastro;