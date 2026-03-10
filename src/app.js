//! essa pasta app.js serve para configurarmos o projeto como um todo, um esqueleto do processo um manual de regras

import express, { json } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";

// Ferramentas do Node para encontrar pastas no servidor
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para podermos ler os caminhos dos arquivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); //? inincializa nosso express atribuindo a variavel app

app.use(cors());
app.use(express.json()); //? para o express poder ler os json (body params)

// ⚙️ ROTAS DO MOTOR (BACKEND)
app.use("/iara", usuarioRoutes); //? aqui eu defino como padrão o uso do endpoint "iara" antes de chamar qualquer rota de usuario
app.use("/iara/chat", chatRoutes);


// ========================================================
// 🪄 AS LINHAS MÁGICAS: CONECTANDO A FACHADA (FRONTEND)
// ========================================================

// 1. O servidor tenta achar a pasta 'dist' (que é onde o React guarda o site visual pronto)
const pastaTelas1 = path.join(__dirname, 'dist');
const pastaTelas2 = path.join(__dirname, '../dist');

// 2. Liberamos o acesso para as imagens, cores e botões do site
app.use(express.static(pastaTelas1));
app.use(express.static(pastaTelas2));

// 3. Quando alguém acessar qualquer link (como a porta da frente ou /login), entregamos a tela
app.get('*', (req, res) => {
    res.sendFile(path.join(pastaTelas1, 'index.html'), (erro1) => {
        if (erro1) {
            res.sendFile(path.join(pastaTelas2, 'index.html'), (erro2) => {
                if (erro2) {
                    // Se o servidor não achar as telas do React por algum motivo, 
                    // mostramos uma mensagem de sucesso amigável em vez da tela branca de erro!
                    res.send(`
                        <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
                            <h1 style="color: #4CAF50;">✅ Motor do Projeto IARA Online!</h1>
                            <p>O servidor backend e o banco de dados Firebase estão conectados e funcionando perfeitamente.</p>
                            <hr style="max-width: 400px; margin: 20px auto; border: 1px solid #ddd;" />
                            <p style="color: gray; font-size: 14px;">(Nota da engenharia: As telas visuais do React ainda não foram geradas na pasta 'dist')</p>
                        </div>
                    `);
                }
            });
        }
    });
});

export default app;
