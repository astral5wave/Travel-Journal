// const multer = require('multer');
// const path = require('path');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'uploads',  // Cloudinary folder name
//         allowedFormats: ['jpg', 'jpeg', 'png'],  // File types allowed
//         public_id: (req, file) => Date.now() + path.extname(file.originalname)
//     }
// });

// const upload = multer({ storage });
// module.exports = upload;

// // const storage = multer.diskStorage({

// //     destination: function (req, file, cb) {
// //         cb(null, "./uploads/"); //destination folder for image uploads 
// //         //cb is error first callback function where if error is null then proceed with path name else handle edge cases
// //     },
// //     filename: function (req, file, cb) {
// //         cb(null, Date.now() + path.extname(file.originalname)); // date in millisecond with extention of old name will be returned and then it is stored as name.
// //     },
// // });

// // const fileFilter = (req, file, cb) => {
// //     if (file.mimetype.startsWith('image/')) {
// //         cb(null, true);   //function that return something based on something
// //     } else {
// //         cb(new Error("File type must be image only"), false);
// //     }
// // };

// // const upload = multer({ storage }, fileFilter);  //fileFilter act middelware to check files first thenmove to store it.
// // module.exports = upload;
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For file cleanup after Cloudinary upload

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config for temporary storage before Cloudinary upload
const storage = multer.diskStorage({
    destination: "./temp/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Cloudinary upload function
const uploadToCloudinary = async (localFilePath) => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: "uploads"
        });
        fs.unlinkSync(localFilePath); // Clean up local file after upload
        return result; // Returns full Cloudinary response
    } catch (error) {
        fs.unlinkSync(localFilePath); // Clean up on error as well
        throw error;
    }
};

module.exports = { upload, uploadToCloudinary,cloudinary  };
