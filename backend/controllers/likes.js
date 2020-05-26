const sauce = require('../models/Sauce');

exports.postLike = (req, res, next)=>{
    sauce.findOne({ _id: req.params.id})

    .then( sauce =>{
        sauce.update(
                { $inc: { likes: 1 }}
            )
        }
    )
    .catch( error => res.status(400).json({ error }))
}

