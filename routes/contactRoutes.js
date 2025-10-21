// const express = require("express");
// const router = express.Router();
// // const { sendContactMessage } = require("../controllers/contactController");

// router.post("/api/contact", sendContactMessage);

// module.exports=router;

// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { submitMessage ,getMessages ,deleteMessage} = require('../controllers/contactController');
const verifyAdmin = require("../middleware/verifyAdmin");
router.post('/api/contact', submitMessage,);
router.get('/api/messages', verifyAdmin, getMessages);
router.delete('/api/messages/:id', verifyAdmin, deleteMessage);
module.exports = router;