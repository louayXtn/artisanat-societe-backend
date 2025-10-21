const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  image_path: String
});

module.exports = mongoose.model('Product', productSchema);