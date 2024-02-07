const router = require("express").Router();
const shopCtrl = require("../controller/shopCtrl");
const authSeller = require("../middleware/authSeller");
const { upload } = require("../multer");
// upload.single("file"),
router.post("/create-shop", shopCtrl.createShop);
router.post("/activate", shopCtrl.activationShop);
router.post("/shop-login", shopCtrl.login);
router.get("/refresh_token", shopCtrl.refreshToken);
router.get("/get-seller", authSeller, shopCtrl.getSeller);
router.get("/get-shop-order", authSeller, shopCtrl.getAllShopOrders);
router.get("/get-shop/:id", shopCtrl.getShopInfor);
router.get("/logout", shopCtrl.logout);
router.put("/update-shop-infor", authSeller, shopCtrl.updateShopInfor);
module.exports = router;
