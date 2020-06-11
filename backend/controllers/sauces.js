const Sauce = require('../models/Sauce');
const fs = require('fs');


/***
 * POST sauce
 *  
 */ 
exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(entities.encode(req.body.sauce));
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(()=>res.status(201).json({message: 'Objet enregistré'})) //une nouvelle ressource a été créée en guise de résultat
    .catch(error => res.status(400).json({error})); //syntaxe invalide
};

/***
 * GET pour toutes les sauces
 */
exports.getSauces = (req, res, next)=>{
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error })); //syntaxe invalide
};

/***
 * GET pour UNE sauce
 */
exports.getSauceById = (req, res, next)=>{
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error })) //Le serveur n'a pas trouvé la ressource demandée
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
    .catch( error => res.status(400).json({ error })) //syntaxe invalide
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
            .then(()=> res.status(201).json({message : 'Objet supprimé'})) //une nouvelle ressource a été créée en guise de résultat
            .catch(error => res.status(400).json({ error })) //syntaxe invalide
        });
    })
    .catch( error => res.status(500).json({ error })) //Le serveur a rencontré une situation qu'il ne sait pas traiter.
    
}

/***
 * POST systeme de like
 */
/***
 * Si l'utilisateur appuie sur like = 1 on ajoute userId à userLiked
 */
exports.likeSauce = (req, res, next)=>{
    if(req.body.like == 1){
        Sauce.updateOne(
            { _id: req.params.id},
            {
                $inc:{likes: 1 },
                $push: { usersLiked: req.body.userId}
            }
        )
        .then((sauce)=> res.status(201).json({ message: "LIKE" })) //une nouvelle ressource a été créée en guise de résultat
    
        .catch( error => res.status(400).json({ error })) //syntaxe invalide
    }
/***
 * Si l'utilisateur appuie sur like = -1 on ajoute userId à userDisliked
 */
    else if(req.body.like == -1){
        Sauce.updateOne(
            { _id: req.params.id},
            {
                $inc:{dislikes: 1 },
                $push: { usersDisliked: req.body.userId}
            }
        )
        .then((sauce)=> res.status(201).json({ message: "DISLIKE" })) //une nouvelle ressource a été créée en guise de résultat
        .catch( error => res.status(400).json({ error })) //syntaxe invalide
    }
/***
 * Si l'utilisateur rappuie sur like = 1 ou -1 on enleve userId à userLiked ou à userDisliked
 */  
    else if (req.body.like == 0){
        Sauce.findOne({_id: req.params.id})
        .then( sauce =>{

            if (sauce.usersLiked.includes( req.body.userId)){
                
                Sauce.updateOne(
                    { _id: req.params.id},
                    {
                        $inc:{ likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                .then(()=> res.status(201).json({message: "Like mit à 0"} )) //une nouvelle ressource a été créée en guise de résultat
                .catch( error => res.status(400).json({ error })) //syntaxe invalide

            }
            else if (sauce.usersDisliked.includes(req.body.userId)){
                Sauce.updateOne(
                    { _id: req.params.id},
                    {
                        $inc:{ dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId}
                    }
                )
                .then(()=> res.status(201).json({ message: "DisLike mit à 0" })) //une nouvelle ressource a été créée en guise de résultat
                .catch( error => res.status(400).json({ error })) //syntaxe invalide
            }
            else {
                return error
            }
        })
        .catch( error => res.status(500).json({ error })) //Le serveur a rencontré une situation qu'il ne sait pas traiter.
    }
    else{
        return error
    }
}    
