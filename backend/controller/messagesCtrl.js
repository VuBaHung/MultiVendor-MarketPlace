const Message = require("../model/MessageModel");
const messagesCtrl = {
  createMessage: async (req, res) => {
    try {
      const messageData = req.body;
      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;
      const message = new Message({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });
      await message.save();
      res.status(201).json({ message });
    } catch (error) {
      res.status(400).json(error);
    }
  },
  //get all messages with conversation id
  getAllMessages: async (req, res) => {
    try {
      console.log(req.params.id);
      const messages = await Message.find({ conversationId: req.params.id });

      res.status(201).json({ messages });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = messagesCtrl;
