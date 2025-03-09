const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/"); //destination folder for image uploads 
        //cb is error first callback function where if error is null then proceed with path name else handle edge cases
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // date in millisecond with extention of old name will be returned and then it is stored as name.
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);   //function that return something based on something
    } else {
        cb(new Error("File type must be image only"), false);
    }
};

const upload = multer({ storage }, fileFilter);  //fileFilter act middelware to check files first thenmove to store it.
module.exports = upload;