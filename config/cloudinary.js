
require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const CLOUD_NAME = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const API_KEY = (process.env.CLOUDINARY_API_KEY || '').trim();
const API_SECRET = (process.env.CLOUDINARY_API_SECRET || '').trim();

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing Cloudinary env vars. Check .env');
  throw new Error('Missing Cloudinary credentials');
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const base = file.originalname ? file.originalname.split('.')[0] : 'upload';
    return {
      folder: 'products',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${base}`,
      resource_type: 'image',
    };
  },
});

module.exports = { cloudinary, storage };
