// const express = require('express');
// const router = express.Router();
// const { addProduct, deleteProduct, getAllProducts, searchProductsByName,getProductById } = require('../controllers/productsController');

// router.post('/products', addProduct);
// router.delete('/products/:id', deleteProduct);
// router.get('/products', getAllProducts);
// router.get('/products/search', searchProductsByName);
// router.get('/products/:id', getProductById);
// module.exports = router;
// ...existing code...
const express = require('express');
const router = express.Router();
const { addProduct, deleteProduct, getAllProducts, searchProductsByName, getProductById } = require('../controllers/productsController');

router.post('/products', ...addProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products', getAllProducts);
router.get('/products/search', searchProductsByName);
router.get('/products/:id', getProductById);
module.exports = router;
// ...existing code...