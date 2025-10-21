const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const fs = require('fs');

// إعداد التخزين في مجلد واحد فقط
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// دالة إضافة المنتج
const addProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, category, price, description } = req.body;
      if (!req.file) return res.status(400).json({ message: 'الصورة مطلوبة' });

      const imagePath = `/images/${req.file.filename}`;

      const newProduct = new Product({
        name,
        category,
        price: parseFloat(price),
        description,
        image_path: imagePath
      });

      await newProduct.save();
      res.status(201).json({ message: 'تمت إضافة المنتج بنجاح', product: newProduct });
    } catch (error) {
      res.status(500).json({ message: 'خطأ في إضافة المنتج', error });
    }
  }
];
// دالة حذف المنتج
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }

    // حذف الصورة من مجلد images
    const imagePath = path.join(__dirname, '../images', path.basename(product.image_path));
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.warn('تعذر حذف الصورة:', err.message);
      }
    });

    res.status(200).json({ message: 'تم حذف المنتج والصورة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء الحذف', error });
  }
};

// module.exports = { addProduct, deleteProduct };
// دالة جلب كل المنتجات
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المنتجات', error });
  }
};

// دالة البحث حسب الاسم
const searchProductsByName = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'كلمة البحث مطلوبة' });

  try {
    const regex = new RegExp(q, 'i'); // بحث غير حساس لحالة الحروف
    const products = await Product.find({ name: regex })
      .select('name price image_path') // فقط الحقول المطلوبة
      .limit(10); // تحديد عدد النتائج

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'خطأ أثناء البحث', error });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المنتج', error });
  }
};

module.exports = { addProduct, deleteProduct, getAllProducts , searchProductsByName, getProductById};