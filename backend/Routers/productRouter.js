const router = require("express").Router();
const productCtrl = require("../controller/productCtrl");
const authSeller = require("../middleware/authSeller");
const auth = require("../middleware/auth");
router.post("/create-product", productCtrl.createProduct);
router.get("/get-all-products/:id", productCtrl.getAllShopProduct);
router.get("/get-product/:id", productCtrl.getProductDetail);
router.get("/get-all-products", productCtrl.getAllProducts);
router.delete(
  "/delete-shop-product/:id",
  authSeller,
  productCtrl.deteleShopProduct
);
router.put("/update-product-review", auth, productCtrl.updateProductReview);

module.exports = router;
