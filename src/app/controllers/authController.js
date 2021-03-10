const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

function generateToken(params = {}){
    /*
        Gera token para autenticacao do usuario
    */
    return jwt.sign(params, authConfig.secret, {
        /*
            token expira em um dia
        */
        expiresIn: 86400,
    });
}

async function register(req, res) {
    const { email } = req.body;

    try {
        /*
            Nao e possivel adicionar usuario a base
            pois usuario ja existe
        */
        if(await User.findOne({ email }))
            return res.status(204).json(); 
        
        const user = await User.create(req.body);

        /*
            Nao retornar o campo 'password'
            na de resposta da requisicao
        */
        user.password = undefined;
        return res.status(200).json({user, token: generateToken({ id: user.id })});
    
    } catch (err) {
        return res.status(204).json();
    }
};

async function authenticate(req, res) {
    const { email, password } = req.body;
    /*
        Busca pelo campo email tabela de usuarios cadastrados
    */
    const user = await User.findOne({ email }).select('+password');
    /*
        Caso nao seja encontrado o campo 'email' do usuario no bd,
        que condiz com o repassado na requisicao, 
        retorna 204: Not Found
    */
    if(!user)
        return res.status(204).json();
    /*
        Caso nao seja encontrado o campo 'password' do usuario no bd,
        que condiz com o repassado na requisicao, 
        retorna 204: Not Found
    */
    if(!await bcrypt.compare(password, user.password))
        return res.status(204).json();

    user.password = undefined;
    /*
        A cada requisicao é gerada um novo
        token e enviado com a resposta da requisicao
    */
    return res.status(200).json({user, token: generateToken({ id: user.id })});
};

async function forgotPassword(req, res) {
    const { email } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) 
            return res.status(204).json();

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'pedro442.rodrigues@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if(err)
                return res.status(400).json({error: 'Nao enviado para o email'});    
            
            return res.status(200).json();
        })
    } catch (err){
        res.status(400).json({error: 'Erro na recuperacao'});
    }
};

async function resetPassword(req, res) {
    const { email, token, password } = req.body;
    try{
        const user = await User.findOne({email}).select('+passwordResetToken passwordResetExpires');
        
        if(!user) 
            return res.status(400).json({error: 'Invalid user'});
        
        if(token !== user.passwordResetToken)
            return res.status(400).json({error: 'Error token'});
        
        const now = new Date;
        if(now > user.passwordResetExpires)
            return res.status(400).json({error: 'Token Expirado'});
        
        user.password = password;
        
        await user.save();
        res.status(200).json();
    } catch(err){
        res.status(400).json({error: 'Erro nao reset'});
    }
};

module.exports = {
    register,
    authenticate,
    forgotPassword,
    resetPassword,
}