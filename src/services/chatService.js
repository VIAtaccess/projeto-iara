import { salvarHistorico, buscarHistorico } from '../models/chatModel';
import axios from 'axios';
import 'dotenv/config';

export const processarNovaMensagem = async (idUsuario, texto) => { //? função para processar uma nova mensagem enviada pelo usuario

    await salvarHistorico(idUsuario, texto, "usuario")
    const n8nUrl = process.env.N8N_WEBHOOK_URL; //? acessa a webhook do n8n salva no .env
    let textoRespostaIA = ""

    try {
        const respostaN8N = await axios.post(n8nUrl, {
                pergunta: mensagem,
                usuarioId: idUsuario
            });

            if (respostaN8N.data && respostaN8N.data.resposta) {
                textoRespostaIA = respostaN8N.data.resposta; //? a variavel textoRespostaIA guarda os dados que ira retornar do n8n que vai vim pela variavel resposta
            } else {
                textoRespostaIA = "A IA processou, mas não retornou texto.";
            }
        
    } catch (error) {
        console.error("Erro no n8n:", error.message);
        textoRespostaIA = "Desculpe, eu estou indisponivel no momento.";
    }


    await salvarHistorico(idUsuario, textoRespostaIA, 'ia');

    return textoRespostaIA;
};



export const buscarHistoricoUsuario = async (idUsuario) => {
    return await buscarHistorico(idUsuario);
};