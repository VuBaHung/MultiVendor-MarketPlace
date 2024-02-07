const eventCtrl = require("../controller/eventCtrl");
const authSeller = require("../middleware/authSeller");
const router = require("express").Router();

router.post("/create-event", eventCtrl.createEvent);
router.get("/get-all-events/:id", eventCtrl.getAllEventShop);
router.get("/get-all-events", eventCtrl.getAllEvent);
router.delete("/delete-shop-event/:id", authSeller, eventCtrl.deteleShopEvent);

module.exports = router;
