// require("dotenv").config();
// const express = require("express");
// const app = express();
// const connectDB = require("./config/dbconn");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const path = require("path");
// const corsoptions = require("./config/corsoptions");

// const PORT = process.env.PORT || 5000;

// connectDB();
// app.use(cors(corsoptions));
// app.use(cookieParser());
// app.use(express.json());

// app.use("/", express.static(path.join(__dirname, "public")));
// app.use("/", require("./routes/root"));
// app.use("/auth", require("./routes/authroutes"));
// app.use("/api", require("./routes/authroutes"));
// app.use("/users", require("./routes/userroutes"));
// // app.all("*", (req, res) => {
// //   res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
// // });
// const { addProduct,deleteProduct } = require("./controllers/productsController");
// app.post("/api/products", addProduct);
// app.delete("/api/products/:id", deleteProduct);
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use('/api', require('./routes/productRoutes'));
// app.use("/api", require("./routes/orderRoutes"));
// // app.use("/", require("./routes/contactRoutes"));
// app.use(require('./routes/contactRoutes'))
// mongoose.connection.once("open", () => {
//   console.log("Connected to MongoDB");
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });
// mongoose.connection.on("error", (err) => {
//   console.error("MongoDB connection error:", err);
// });
// ...existing code...
// ...existing code...
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbconn");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const corsoptions = require("./config/corsoptions");

const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors(corsoptions));
app.use(cookieParser());
app.use(express.json());

// ensure Cloudinary config loads before routes that use multer-storage-cloudinary
require('./config/cloudinary');

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authroutes"));
// app.use("/api", require("./routes/authroutes")); // optional duplicate - remove if unnecessary
app.use("/users", require("./routes/userroutes"));
// remove direct registration of controller middleware (productRoutes handles this)
// const { addProduct,deleteProduct } = require("./controllers/productsController");
// app.post("/api/products", addProduct);
// app.delete("/api/products/:id", deleteProduct);

// app.use("/images", express.static(path.join(__dirname, "images")));
app.use('/api', require('./routes/productRoutes'));
app.use("/api", require("./routes/orderRoutes"));
app.use(require('./routes/contactRoutes'));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err?.status || 500).json({ message: 'Server error', error: err?.message || String(err) });
});
app.use('/ping', (req, res) => res.status(200).send('Waken!!!'));
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
// ...existing code...

