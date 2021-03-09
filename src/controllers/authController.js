const User = require('../models/user');

async function register(req, res) {
    const { email } = req.body;

    try {
        if(await User.findOne({ email }))
            return res.status(400).json({error: 'Usuario existente'}); 
        
        const user = await User.create(req.body);

        user.password = undefined;

        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({error: 'Falha no Registro'});
    }
};

module.exports = {
    register,
}