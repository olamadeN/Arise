const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
      
    }
})
  
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
      cb(null,true)
    }else{
      console.log('only jpg & png file supported')
      cb({message:'Unsupported file format'}, false)
    }
  },
  limits:{fieldSize:1024 * 1024}

})

module.exports = {upload};