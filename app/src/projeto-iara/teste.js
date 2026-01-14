 // Importa o db que configuramos no arquivo firebase.js
// Como este arquivo está na raiz, entramos em ./src/config/firebase
import { db } from './src/config/firebase.js';

async function testarConexao() {
  console.log("⏳ Tentando conectar e gravar...");

  try {
    // Tenta criar/acessar a coleção 'usuarios' e adicionar um documento
    const docRef = await db.collection('usuarios').add({
      nome: "Admin Teste",
      email: "admin@teste.com",
      dataTeste: new Date(),
      mensagem: "Se você está lendo isso, o backend conectou!"
    });

    console.log("✅ SUCESSO!");
    console.log("📄 Documento criado com ID:", docRef.id);
    console.log("🚀 Pode ir lá no painel do Firebase conferir.");

  } catch (erro) {
    console.error("❌ ERRO ao conectar no Firestore:", erro);
  }
}

testarConexao();