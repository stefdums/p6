const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
let tentatives = 0;

exports.signup = (req, res , next)=>{
    if((req.body.password).length > 9){ // Pour demander un password d'au moins 10 caracteres.
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(()=> res.status(201).json({ message: 'utilisateur créée'}))
            .catch(error => res.status(400).json({error})) //syntaxe invalide
            })
        .catch(error => res.status(500).json({error})) //Le serveur a rencontré une situation qu'il ne sait pas traiter.
    }else {
        return res.status(401).json({error: "Password trop court, 10 caractères minimun"})
    }    
};

exports.login = (req, res , next)=>{
    
    User.findOne({ email: req.body.email})
    .then( user => {
        if (!user){
            return res.status(401).json({error: "utilisateur non trouvé"}) //identification est nécessaire
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            
            if(!valid){ // Pour limiter le nombre de tentative de connexion
                tentatives++
                console.log(tentatives)
                if (tentatives == 3 ){
                    
                   
                    User.updateOne(
                        { _id: user._id},
                        {email: "email@corrompu.com",  _id: user._id}
                    )
                    .then( () => res.status(201).json({error: "trop de tentative de connexion, veuillez contacter le service client"})) //  nouvelle ressource a été créée 
                    .catch(error => res.status(500).json({error})) //Le serveur a rencontré une situation qu'il ne sait pas traiter.
                    
                    console.log('trop de tentative de connexion, veuillez contacter le service client')    
                }
                
                return res.status(401).json({error: " MDP faux "})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error})) //Le serveur a rencontré une situation qu'il ne sait pas traiter.
    })
    .catch(error => res.status(500).json({ error})) //Le serveur a rencontré une situation qu'il ne sait pas traiter.
};