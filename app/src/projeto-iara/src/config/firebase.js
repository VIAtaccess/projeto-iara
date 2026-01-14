//?Essa pasta serve para construir a configuração do firebase


import admin from 'firebase-admin'; 
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const contaDeServico = require('../../chaveJsonFirebaseFirestore.json'); //? lendo o json e importando a minha chave de segurança do firestore





if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(contaDeServico)
  });
}


const db = admin.firestore(); //? inicaliza o firestore atribuindo a variavel db

const auth = admin.auth(); //? inicializa o firebase auth atribuindo a variavel auth

export{ 
  db, 
  auth,
  admin 
}; //? modulos exportados para utilizarmos em outros locais