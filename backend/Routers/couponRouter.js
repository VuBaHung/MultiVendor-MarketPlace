const discountCodeCtrl = require("../controller/discountCodeCtrl");
const authSeller = require("../middleware/authSeller");
const router = require("express").Router();

router.post("/create-coupoun", discountCodeCtrl.createCoupon);
router.get("/get-all-coupons/:name", discountCodeCtrl.getAllCoupon);
router.delete("/delete-shop-coupon/:id", discountCodeCtrl.deteleShopCoupon);
router.get("/get-coupon-value/:name", discountCodeCtrl.getCouponCode);
module.exports = router;
