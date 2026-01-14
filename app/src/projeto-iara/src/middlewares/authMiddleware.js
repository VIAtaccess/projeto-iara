import jwt from "jsonwebtoken";
import 'dotenv/config'; //? Use o .env com dotenv/config para guardar a chave JWT_SECRET em segurança fora do código.

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado: token inválido!'}); 
    }

    const token = authHeader.split(' ')[1];

    try {                                           //? Usa jwt.verify para decodificar e validar a assinatura e a expiração do token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.userId = decoded.id;              //? O controller saberá quem está fazendo a requisição e poderá aplicar regras de negócio (ex.: só editar/deletar a própria conta).

    next();                              //? Se a verificação for bem-sucedida, prossegue para a próxima função (o Controller)

    } catch (err) {
    return res.status(401).json({ message: 'Acesso negado: Token expirado'})
    }
}
