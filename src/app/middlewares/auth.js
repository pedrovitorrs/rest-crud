const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    /*
        Verificando se o token foi
        repassado no cabecalho da requisicao
    */
    if(!authHeader)
        return res.status(401).send({error: 'O Token nao foi informado'});

    const parts = authHeader.split(' ');
    /*
        Verificando a integridade do token de acordo
        com o padrao => [Bearer, 'hash do token']
    */
    if(!parts.length === 2)
        return res.status(401).send({error: 'Token error'});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: 'Token mal formado'});
    
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({error: 'Token Invalido'}); 

        req.userId = decoded.id;
        next();
    })
};