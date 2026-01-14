
import {processarNovaMensagem, obterHistoricoUsuario} from '../services/chatService.js'; 

export const enviarMensagemController = async (req, res) => {
    try {
        const { mensagem } = req.body;
        const idUsuario = req.userId;

        if (!mensagem) {
            return res.status(400).json({ error: "Mensagem vazia." });
        }

      
        const respostaIA = await processarNovaMensagem(idUsuario, mensagem);

        return res.status(200).json({ resposta: respostaIA });

    } catch (error) {
        return res.status(500).json({ error: "Erro interno no chat." });
    }
};



export const buscarHistoricoController = async (req, res) => {
    try {
        const idUsuario = req.userId;
        const historico = await obterHistoricoUsuario(idUsuario);
        
        return res.status(200).json(historico);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};