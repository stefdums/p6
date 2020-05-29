const express = require('express')
const router = express.Router();


const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// 'api/sauces' route de base du router
router.post('/', auth,  multer, saucesCtrl.createSauce);
router.get('/:id', auth,  saucesCtrl.getSauceById);
router.get('/' , auth,  saucesCtrl.getSauces);
router.put('/:id', auth,  multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce)

//router.post('/:id/like', saucesCtrl.dislikeSauce)
router.post('/:id/like', auth,  saucesCtrl.likeSauce)


module.exports = router;
