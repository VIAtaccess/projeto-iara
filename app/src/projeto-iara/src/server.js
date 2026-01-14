//! essa pasta é o nosso motor de ignição ela é responsavel apenas por ligar o nosso servifor e fazer tudo rodar

import app from './app.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`\n Servidor rodando na porta ${PORT}`);
  
});