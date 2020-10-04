const multer = require('multer')

//armazenamento
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/images')
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now().toString()}-${file.originalname}`)
  }
})

//tipo de imagens
const fileFilter = (req, file, callback)=>{
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
  .find(accepetFormat => accepetFormat == file.mimetype)

  if(isAccepted){
    return callback(null, true)
  }

  return callback(null, false)
}

module.exports = multer({
  storage,
  fileFilter
})