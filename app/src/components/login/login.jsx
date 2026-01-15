import './login.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import { toast } from 'react-toastify';

function Login() {
  const [visivel, setVisivel] = useState(false);
  
  
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
     
      const response = await api.post('/iara/login', { 
        email: email, 
        senha: senha 
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuarioNome', response.data.usuario.nome);
      localStorage.setItem('usuarioId', response.data.usuario.id);
      
      
      toast.success(`Bem-vindo(a), ${response.data.usuario.nome}!`);
      
      navigate('/menu'); 

    } catch (error) {
      console.error("Erro no login:", error);
     
      toast.error('Email ou senha incorretos. Verifique seus dados.');
    }
  }

  return (
    <div className={`loginContainer ${visivel ? 'fade-in' : ''}`}>

      <div className="titulosLogin">
        <h1 className="titleolaLogin">Olá,</h1>
        <h1 className="titlebemvindoLogin">Bem-vindo</h1>
        <h1 className="titleiaraLogin">
          <i id="aIARA">à</i> IAra
        </h1>
      </div> 

      <img src="/img/iara.png" alt="iara" className="logoiara" />

      <form className="formLogin" onSubmit={handleSubmit}>
        <input
          type="email" 
          placeholder="Email" 
          className="inputLogin"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="inputPassword"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" className="btnLogin">
          COMEÇAR
        </button>
        
        <p className="linkCadastro">
            Não tem conta? <span 
                className="spanCadastro"
                onClick={() => navigate('/cadastro')}
            >
                Crie agora
            </span>
        </p>

      </form>

      <img src="/img/anjos.png" alt="anjosDigitais" className="anjosDigitais" /> 

    </div>
  );
}

export default Login;