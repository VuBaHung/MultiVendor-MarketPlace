const Conversation = require("../model/ConversationModel");
const conversationCtrl = {
  createConversation: async (req, res) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;
      const isConversationExist = await Conversation.findOne({ groupTitle });
      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({ success: true, conversation });
      } else {
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        res.status(200).json({ conversation, msg: "Success" });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },
  getSellerConversation: async (req, res) => {
    try {
      //   console.log(req.params.sellerId);
      const conversation = await Conversation.find({
        members: { $in: ["659cff4bd89b95ab8aea8f48"] },
      }).sort({
        updatedAt: -1,
        createdAt: -1,
      });

      res.status(201).json({ conversation });
    } catch (error) {
      res.status(400).json(error);
    }
  },
  updateLastMessage: async (req, res) => {
    try {
      const { lastMessage, lastMessagesId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessagesId,
      });

      res.status(201).json({ conversation });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = conversationCtrl;
