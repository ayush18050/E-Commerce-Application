const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: "duxvbnwdg",
  api_key: '935436478754926',
  api_secret: "njuhdcSsCw-kj5R2rYcYnmJc6iA"
});

const storage= new multer.memoryStorage();

async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto"
    });
    return result;
}

const upload = multer({ storage });

module.exports = {
    imageUploadUtil,
    upload
};