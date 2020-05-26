const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'images')
    },
    filename: (req, file, callback) =>{

//on remplace les espaces dans le nom du fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
// on rend le nom unique        
        callback(null, name + Date.now() + '.' + extension);
    }
});    

module.exports = multer({ storage: storage}).single('image');