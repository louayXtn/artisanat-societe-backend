
const multer = require('multer');
const Product = require('../models/Product');
const { cloudinary, storage } = require('../config/cloudinary');

const upload = multer({ storage });

// addProduct is an array: multer middleware then handler

const addProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      // console.dir(req.file, { depth: 2 });
      if (!req.file) return res.status(400).json({ message: 'Image required' });

      const imageUrl = req.file.path || req.file.secure_url || req.file.url;
      const imageId = req.file.filename || req.file.public_id;

      const newProduct = new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        description: req.body.description,
        image_path: imageUrl,
        imageId,
      });

      await newProduct.save();
      return res.status(201).json({ product: newProduct });
    } catch (err) {
      // log full error for debugging
      console.error('addProduct error:', err && err.stack ? err.stack : err);
      // return JSON so client JSON.parse doesn't fail
      return res.status(500).json({ message: 'Server error', error: err.message || err });
    }
  }
];

function getCloudinaryPublicId(idOrUrl) {
  if (!idOrUrl) return null;
  // already a public_id (may include folder)
  if (!idOrUrl.startsWith('http')) return idOrUrl;
  // it's a URL — extract the part after '/upload/' and remove version and extension
  const parts = idOrUrl.split('/upload/');
  if (parts.length < 2) return null;
  let after = parts[1]; // e.g. "v12345/products/xxxxx.jpg"
  // remove version prefix if present (v12345/)
  if (after.startsWith('v') && after.includes('/')) {
    after = after.substring(after.indexOf('/') + 1);
  }
  // remove query string and file extension
  after = after.split('?')[0].replace(/\.[^/.]+$/, '');
  return after;
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });

    const storedId = product.imageId || product.image_path;
    const publicId = getCloudinaryPublicId(storedId);

    if (publicId) {
      try {
        // console.log('Deleting Cloudinary image public_id:', publicId);
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: 'image',
          invalidate: true,
        });
        // console.log('Cloudinary destroy result:', result);
      } catch (e) {
        console.warn('Cloudinary delete failed:', e && e.message ? e.message : e);
      }
    } else {
      console.warn('No image public id found to delete for product', id);
    }

    return res.status(200).json({ message: 'تم حذف المنتج' });
  } catch (error) {
    console.error('deleteProduct error:', error && error.stack ? error.stack : error);
    return res.status(500).json({ message: 'حدث خطأ أثناء الحذف', error: error.message });
  }
};

// ...existing code...
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean(); // lean() returns plain objects
    // optional: ensure image_path exists for every product
    const mapped = products.map(p => ({
      ...p,
      image_path: p.image_path || null
    }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error('getAllProducts error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message || String(err) });
  }
};

const mongoose = require('mongoose');


const searchProductsByName = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'كلمة البحث مطلوبة' });

  try {
    const safeQ = String(q).slice(0, 100); // limit length
    const regex = new RegExp(safeQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // escape regex chars
    const products = await Product.find({ name: regex })
      .select('name price image_path')
      .limit(10)
      .lean();
    return res.status(200).json(products);
  } catch (error) {
    console.error('searchProductsByName error:', error);
    return res.status(500).json({ message: 'خطأ أثناء البحث', error: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
  try {
    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    return res.status(200).json(product);
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ message: 'خطأ في جلب المنتج', error: error.message });
  }
};


module.exports = { addProduct, deleteProduct, getAllProducts, searchProductsByName, getProductById };
