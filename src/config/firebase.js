// Aqui está o novo código para o arquivo src/config/firebase.js
// Ele é inteligente: vai procurar a chave no Railway primeiro.
// Se não achar, tenta procurar o arquivo no seu computador.

const admin = require('firebase-admin');

let serviceAccount;

// 1. Tenta ler a chave secreta de dentro do Railway (Variável de Ambiente)
if (process.env.FIREBASE_CREDENTIALS) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        console.log("Chave do Firebase lida pelo Railway com sucesso!");
    } catch (error) {
        console.error("Erro ao ler as credenciais do Firebase no Railway. Verifique se copiou o texto inteiro.", error);
    }
} 
// 2. Se não estiver no Railway, tenta ler do arquivo físico (para quando você for testar no seu próprio computador)
else {
    try {
        serviceAccount = require('../../chaveJsonFirebaseFirestore.json');
        console.log("Chave do Firebase lida pelo arquivo local com sucesso!");
    } catch (error) {
        console.log("Aviso: Nenhuma chave do Firebase encontrada. O banco de dados pode não funcionar.");
    }
}

// 3. Inicia a conexão com o banco de dados (O Cofre)
if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// Exporta para o resto do projeto poder usar
module.exports = admin;
