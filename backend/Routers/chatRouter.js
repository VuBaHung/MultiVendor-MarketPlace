const conversationCtrl = require("../controller/conversationCtrl");
const messagesCtrl = require("../controller/messagesCtrl");
const router = require("express").Router();

router.post("/create-conversation", conversationCtrl.createConversation);
router.get(
  "/get-all-seller-conversation/:sellerId",
  conversationCtrl.getSellerConversation
);
router.get("/get-all-messages/:id", messagesCtrl.getAllMessages);
router.put("/update-last-message/:id", conversationCtrl.updateLastMessage);
router.post("/create-new-message", messagesCtrl.createMessage);
module.exports = router;
