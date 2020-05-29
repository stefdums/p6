const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
let tentatives = 0;

exports.signup = (req, res , next)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(()=> res.status(201).json({ message: 'utilisateur créée'}))
        .catch(error => res.status(400).json({error}))
        })
    .catch(error => res.status(500).json({error}))
};

exports.login = (req, res , next)=>{
    
    User.findOne({ email: req.body.email})
    .then( user => {
        if (!user){
            return res.status(401).json({error: "utilisateur non trouvé"})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            
            if(!valid){ // Pour limiter le nombre de tentative de connexion
                tentatives++
                console.log(tentatives)
                if (tentatives == 3 ){
                    console.log('trop de connexion')
                   
                    User.updateOne(
                        { _id: user._id},
                        {email: "email@corrompu.com",  _id: user._id}
                    )
                    .then( () => res.status(401).json({error: "utilisateur non trouvé"}))
                    .catch(error => res.status(500).json({error}))
                    
                    
                    
                    
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
        .catch(error => res.status(500).json({ error}))
    })
    .catch(error => res.status(500).json({ error}))
};