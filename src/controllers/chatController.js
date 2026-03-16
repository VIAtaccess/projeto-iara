import { salvarHistorico, buscarHistorico } from '../models/chatModel.js';
import axios from 'axios';
import 'dotenv/config';

export const processarNovaMensagem = async (idUsuario, mensagem) => { 
    // Salva a mensagem que o usuário digitou
    await salvarHistorico(idUsuario, mensagem, "usuario");
    
    const n8nUrl = process.env.N8N_WEBHOOK_URL; 

    console.log("Tentando conectar em:", n8nUrl);
    
    let textoRespostaIA = "";

    try {
        const respostaN8N = await axios.post(n8nUrl, {
                pergunta: mensagem,
                usuarioId: idUsuario
            });

        // 🕵️‍♀️ O DETETIVE: Imprime no log do Railway exatamente o que o n8n mandou de volta
        console.log("Resposta bruta recebida do n8n:", JSON.stringify(respostaN8N.data));

        const dados = respostaN8N.data;

        // 🧠 Lógica inteligente para encontrar a resposta, venha com o nome que vier!
        if (dados) {
            if (dados.output) {
                textoRespostaIA = dados.output;
            } else if (dados.text) {
                textoRespostaIA = dados.text;
            } else if (dados.response) {
                textoRespostaIA = dados.response;
            } else if (Array.isArray(dados) && dados[0] && dados[0].output) {
                textoRespostaIA = dados[0].output;
            } else if (Array.isArray(dados) && dados[0] && dados[0].text) {
                textoRespostaIA = dados[0].text;
            } else {
                // Se a caixa tiver um nome muito estranho, a IAra devolve o pacote todo para nós vermos!
                textoRespostaIA = "Recebi os dados, mas o formato é novo: " + JSON.stringify(dados).substring(0, 100) + "...";
            }
        } else {
            textoRespostaIA = "A IA processou, mas os dados vieram vazios.";
        }
        
    } catch (error) {
        console.error("Erro no n8n:", error.message);
        textoRespostaIA = "Desculpe, eu estou indisponivel no momento.";
    }

    // Salva a resposta da IA e devolve para a tela
    await salvarHistorico(idUsuario, textoRespostaIA, 'ia');
    return textoRespostaIA;
};

export const buscarHistoricoUsuario = async (idUsuario) => {
    return await buscarHistorico(idUsuario);
};
