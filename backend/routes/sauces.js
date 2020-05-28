const express = require('express')
const router = express.Router();


const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// 'api/sauces' route de base du router
router.post('/',  multer, saucesCtrl.createSauce);
router.get('/:id',  saucesCtrl.getSauceById);
router.get('/' ,  saucesCtrl.getSauces);
router.put('/:id',  multer, saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauce)

//router.post('/:id/like', saucesCtrl.dislikeSauce)
router.post('/:id/like', saucesCtrl.likeSauce)


module.exports = router;
