const Shop = require("../model/ShopModel");
const Product = require("../model/ProductModel");
const Event = require("../model/EventModel");
const DiscountCode = require("../model/DiscountCodeModel.js");

const discountCodeCtrl = {
  createCoupon: async (req, res) => {
    try {
      const nameCode = req.body.name;
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      const code = await DiscountCode.find({ name: nameCode });
      const newCode = req.body;
      newCode.shop = shop;
      console.log({ newCode });
      if (code.length != 0) {
        return res
          .status(400)
          .json({ msg: "The Coupoun code is already exist." });
      } else {
        const coupounCode = await DiscountCode.create(newCode);

        return res.status(201).json({
          coupounCode,
          msg: "Create coupoun code success!",
        });
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getAllCoupon: async (req, res) => {
    try {
      // const ObjectId = mongoose.Types.ObjectId;
      // const objectIdToSearch = ObjectId("659a191098547350fcd05f11");
      // const shopId = req.params.id;
      // console.log({ shopId });
      const coupons = await DiscountCode.find({ "shop.name": req.params.name });

      // const coupons = await DiscountCode.findById({
      //   "shop._id": objectIdToSearch,
      // });

      res.json(coupons);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getCouponCode: async (req, res) => {
    try {
      const nameCoupon = req.params.name;
      const coupons = await DiscountCode.findOne({ name: nameCoupon });

      res.status(200).json({ coupons, sucess: "Get Coupon code success!" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  deteleShopCoupon: async (req, res) => {
    try {
      const couponId = req.params.id;
      const coupon = await DiscountCode.findByIdAndDelete(couponId);
      if (!coupon) {
        return res.status(400).json({ msg: "The coupon is not exist" });
      }
      return res.status(201).json({ msg: "Delete coupon success" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
module.exports = discountCodeCtrl;
