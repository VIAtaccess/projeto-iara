import {db} from '../config/firebase.js'
import { admin } from '../config/firebase.js'

export const salvarHistorico = async (idUsuario, texto, quemEnviou) => {
    try {
        const historicoDocRef = db.collection('usuarios').doc(idUsuario).collection('historico'); //? cria uma subcoleção para guardar o historico da conversa da ia

        await historicoDocRef.add({
            texto: texto,
            quemEnviou: quemEnviou,
            dataEnvio: admin.firestore.FieldValue.serverTimestamp()}); //? timestamp pra saber a data de envio
            
            return { message: 'Mensagem salva com sucesso' };
        }
        
    catch (error) {
        console.error("Erro ao salvar o historico:", error);
        throw new Error('Não foi possível salvar o historico.')
    }
}

export const buscarHistorico = async (idUsuario) => {
    try {
        const historicoDocRef = db.collection('usuarios').doc(idUsuario).collection('historico').orderBy('dataEnvio', 'asc'); //? busca o historico filtrando pela ordem do mais antigo pro mais recente
        const snapshot = await historicoDocRef.get();
        
        const historico = [];
        snapshot.forEach(doc => {
            let dadosDaMensagem = doc.data();            
            dadosDaMensagem.id = doc.id;
            historico.push(dadosDaMensagem);
        });

        return historico;

    } catch (error) {
        console.error("erro ao buscar historico", error)
        throw new Error("erro ao carregar seu histórico")
    }
}

export {salvarHistorico, buscarHistorico}