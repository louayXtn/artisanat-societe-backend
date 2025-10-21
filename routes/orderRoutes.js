const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders,deleteOrder } = require("../controllers/orderController");
const verifyAdmin = require("../middleware/verifyAdmin");

// استقبال الطلب من العميل
router.post("/orders", createOrder);

// عرض الطلبات للأدمين
router.get("/admin/orders", verifyAdmin, getAllOrders);
router.delete("/admin/orders/:id", verifyAdmin, deleteOrder);
module.exports = router;
