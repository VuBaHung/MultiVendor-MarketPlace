const router = require("express").Router();
const paymentCtrl = require("../controller/paymentCtrl");
const authSeller = require("../middleware/authSeller");

router.post("/payment-process", paymentCtrl.paymentProcess);
router.get("/stripeapikey", paymentCtrl.stripeApiKey);
module.exports = router;
