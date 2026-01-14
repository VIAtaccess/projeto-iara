//? nosso primeiro model, basicamente essa pasta é responsavel por jogar tudo pro firestore

import {db} from '../config/firebase.js'


const adicionarUsuario = async(dadosUsuario) => {
    try {
        const usuarioDocRef = await db.collection("usuarios").add({ //? cria uma coleção de dados com o nome de "usuarios"
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        senha: dadosUsuario.senha,
        temaDeInteresse: dadosUsuario.temaDeInteresse,
        criadoEm: new Date()
    
    })
    return usuarioDocRef.id //? retorna o Id para quem chamar o adicionarUsuario

    } catch (error) {
        console.error("erro ao salvar os dados" , error)
        throw error;
    } //? cairá na caixa catch se acaso o firebase cair
};




const buscarUsuarioPorEmail = async (email) => {
    try {
       const usuarioDocRef = db.collection("usuarios");
       const snapshot = await usuarioDocRef.where("email", "==", email).get()

       if (snapshot.empty){
        return null
       }


       let usuarioEncontrado = null;
        snapshot.forEach(doc => {
        usuarioEncontrado = doc.data()
        usuarioEncontrado.id = doc.id
        });


        return usuarioEncontrado
       
    

    } catch (error) {
        console.error("erro ao buscar usuario", error)
        throw error
    }
}


//! Atualizar/Editar cadastro usuário

const atualizarUsuario = async (idUsuario, dadosAtualizados) => {
    try {
        const usuarioRef = db.collection('usuarios').doc(idUsuario);

        await usuarioRef.update(dadosAtualizados);

        return {message: 'Usuário atualizado com sucesso.'};
    } catch (error) {
        console.log("Erro ao atualizar usuário no FireStore:", error);
        throw new Error ('Falha ao atualizar usuário!');
    }
};

//! Deletar Usuário

const deletarUsuario = async (idUsuario) => {
    try {
        const usuarioRef = db.collection('usuarios').doc(idUsuario);

        await usuarioRef.delete();

        return {message: 'Usuário deletado com sucesso!'};
    } catch (error) {
        console.log("Erro ao deletar usuário no Firestore:", error);
        throw new Error ('Falha ao deletar usuário');
    }
};





export {adicionarUsuario, buscarUsuarioPorEmail, atualizarUsuario, deletarUsuario}; 




//? codigo base para caso precise reverter
//     { const usuarioRef = await db.collection('usuarios').add({
//     ...dadosUsuario,
//     criadoEm: new Date()

// });
// return usuarioRef.id;
//     }