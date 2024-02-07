const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const orderCtrl = {
  createOrder: async (req, res) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      // Group items by its shopID
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }
      //Create order for each shop
      const orders = [];
      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }
      res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(400).json({ msg: error });
    }
  },
  getUserOrder: async (req, res) => {
    try {
      const order = await Order.find({ "user._id": req.user.newUser._id }).sort(
        { createdAt: -1 }
      );
      if (!order) return res.status(400).json({ msg: "No order exist" });
      res.status(200).json({ order });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const newStatus = req.body.status;

      const order = await Order.findById(req.params.id);
      if (!order) return res.status(400).json({ msg: "No order exist" });
      order.status = newStatus;
      if (newStatus == "Delivered") {
        order.deliveredAt = Date.now();
        order.status = "Succeeded";
      }
      await order.save();

      res.status(200).json({ order });
      const updateProduct = async (id, qty) => {
        const product = await Product.findById(id);
        if (!product) return res.status(400).json({ msg: "No product exist" });
        product.stock -= qty;
        product.sold_out += qty;
        await product.save();
      };
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(
          async (item) => await updateProduct(item._id, item.qty)
        );
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refundOrder: async (req, res) => {
    try {
      const { status, orderId } = req.body;
      console.log({ status, orderId });
      const refundOrder = await Order.findById(orderId);
      if (!refundOrder) return res.status(400).json({ msg: "No order exist" });
      refundOrder.status = status;

      await refundOrder.save();
      res
        .status(200)
        .json({ refundOrder, msg: "Order refund request success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateRefundOrder: async (req, res) => {
    try {
      const status = req.body.status;
      console.log({ status });
      const refundOrder = await Order.findById(req.params.id);
      if (!refundOrder) return res.status(400).json({ msg: "No order exist" });
      refundOrder.status = status;

      await refundOrder.save();
      res.status(200).json({ refundOrder, msg: "Success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = orderCtrl;
