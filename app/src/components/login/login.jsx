import './login.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [visivel, setVisivel] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  
  

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(e) {
    e.preventDefault(); // impede reload da página

    if (login === 'Admin' && senha === '1234') {
      navigate('/menu');
    } else {
      alert('Login ou senha inválidos, tente novamente.');
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
          type="text"
          placeholder="Login"
          className="inputLogin"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
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
      </form>

      <img src="/img/anjos.png" alt="anjosDigitais" className="anjosDigitais" /> 

    </div>
  );
}

export default Login;
