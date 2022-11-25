
const path = require('path');
const multer = require('multer');

const sounds = path.join(__dirname, 'public/sounds');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, sounds);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${fileExtension}`;
    callback(null, name);
  }
});

const uploadsMiddleware = multer({ storage }).single('fileUrl');

module.exports = uploadsMiddleware;
