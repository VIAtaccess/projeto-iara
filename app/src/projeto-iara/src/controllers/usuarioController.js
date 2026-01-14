import { cadastrarUsuarioService, loginUsuarioService, editarUsuarioService, deletarUsuarioService} from "../services/usuarioService.js";



/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


//!CADASTRO
const cadastrarUsuarioController = async (req, res) => { //? req = request / res = response

    try {
        const dados = req.body //? o body é um tipo de parametro em formato de json, ele vai receber os dados e colocar dentro da variavel "dados"
        const resultado = await cadastrarUsuarioService(dados) //? aqui ele ta jogando os dados recebidos pelo cliente para o service que ira fazer todas as verificações e regras de negocios de la
        
        res.status(201).json(resultado) //?se tudo der certo no service ele vai cair aqui e retornar um status http 201 o famoso "criou algo"
    } catch (error) {
        res.status(400).json({ erro: error.message }); //? se tiver algo errado la ele cai aqui no bloco catch e retorna o status 400 de erro do lado do cliente
    }
  
}

const loginUsuarioController = async (req, res) => {
    try {
        const dados = req.body
        const resultado = await loginUsuarioService(dados)

        res.status(200).json(resultado)
        
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
    
}

//! Editar usuário

const editarUsuarioController = async(req, res) => {
    try {
        const novosDados = req.body;

        const idUsuarioAutenticado = req.userId;

        const resultado = await editarUsuarioService(idUsuarioAutenticado, novosDados);

        res.status(200).json("dados atualizados com sucesso", resultado);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
}

//! Deletar usuário

const deletarUsuarioController = async (req, res) => {
    try {
        const idUsuarioAutenticado = req.userId;

        const resultado = await deletarUsuarioService(idUsuarioAutenticado);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};




export {cadastrarUsuarioController, loginUsuarioController, editarUsuarioController, deletarUsuarioController};
