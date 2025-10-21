
// const Order = require("../models/Order");
// const axios = require("axios");

// const createOrder = async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
    
//     const message = `
// 🧺 طلب جديد:
// الاسم: ${order.customer.name}
// الهاتف: ${order.customer.phone}
// العنوان: ${order.customer.address}
// المنتجات:
// ${order.items.map(i => `• ${i.name} x${i.quantity}`).join("\n")}
// الإجمالي: ${order.total} د.ت
// `;

//     await axios.post("https://api.ultramsg.com/instance144373/messages/chat", {
//       token: process.env.ULTRAMSG_TOKEN,
//       to: "216XXXXXXXX", // رقمك بصيغة دولية
//       body: message,
//     });

//     res.status(201).json({ message: "تم إرسال الطلب وحفظه" });
//   } catch (err) {
//     res.status(500).json({ message: "خطأ في إرسال الطلب", error: err.message });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "فشل في جلب الطلبات", error: err.message });
//   }
// };

// module.exports = { createOrder, getAllOrders };

// without wastsap msg

const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({ message: "✅ تم حفظ الطلب بنجاح", order });
  } catch (err) {
    console.error("❌ خطأ في حفظ الطلب:", err);
    res.status(500).json({ message: "❌ فشل في حفظ الطلب", error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ خطأ في جلب الطلبات:", err);
    res.status(500).json({ message: "❌ فشل في جلب الطلبات", error: err.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ تم حذف الطلب بنجاح" });
  } catch (err) {
    console.error("❌ خطأ في حذف الطلب:", err);
    res.status(500).json({ message: "❌ فشل في حذف الطلب", error: err.message });
  }
};
module.exports = { createOrder, getAllOrders ,deleteOrder};