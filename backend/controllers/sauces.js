const Sauce = require('../models/Sauce');
const fs = require('fs');


/***
 * POST sauce
 *  
 */ 
exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(()=>res.status(201).json({message: 'Objet enregistré'}))
    .catch(error => res.status(400).json({message : "POST sauces ne marche pas"}));
};

/***
 * GET pour toutes les sauces
 */
exports.getSauces = (req, res, next)=>{
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

/***
 * GET pour UNE sauce
 */
exports.getSauceById = (req, res, next)=>{
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

/***
 * PUT pour UNE sauce
 */
exports.modifySauce = (req, res, next)=>{
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body}
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({message: 'objet modifié'}))
    .catch( error => res.status(400).json({ error }))
};

/***
 * DELETE pour UNE sauce
 */
exports.deleteSauce = (req, res, next)=>{
    Sauce.findOne({ _id: req.params.id})
    .then( sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id})
            .then(()=> res.status(200).json({message : 'Objet supprimé'}))
            .catch()
        });
    })
    .catch( error => res.status(500).json({ error }))
    
}

exports.likeSauce = (req, res, next)=>{
    Sauce.updateOne({ _id: req.params.id}, 
        {
            $inc: { likes: 1},
            $push: { usersLiked: req.params.userId},
            _id: req.params.id
        }) 
    
    .then(()=> res.status(200).json({ message: "like"}))
    .catch( error => res.status(400).json({ error }))
}

exports.dislikeSauce = (req, res , next)=>{
    Sauce.updateOne({ _id: req.params.id}, 
        {
            $inc: { likes: -1},
            $push: { usersDisliked: req.params.userId},
            _id: req.params.id
        })

    .then(()=> res.status(200).json({ message: "dislike"}))
    .catch( error => res.status(400).json({ error }))
}


