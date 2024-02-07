const Shop = require("../model/ShopModel");
const Product = require("../model/ProductModel");
const Event = require("../model/EventModel");
const eventCtrl = {
  createEvent: async (req, res) => {
    try {
      // console.log(req.body);
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(400).json({ msg: "The Shop is not valid." });
      } else {
        const files = req.files;
        // const imgUrls = files.map((file) => `${file.fileName}`);
        const eventData = req.body;
        eventData.images = req.body.images;
        eventData.shop = shop;
        const event = await Event.create(eventData);

        return res.status(201).json({
          event,
        });
      }
    } catch (error) {
      return console.log(error);
    }
  },
  getAllEventShop: async (req, res) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.json(events);
      // return res.status(200).json({ msg: "The email already exists." });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getAllEvent: async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
      // return res.status(200).json({ msg: "The email already exists." });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  deteleShopEvent: async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findByIdAndDelete(eventId);
      if (!event) {
        return res.status(400).json({ msg: "The event is not exist" });
      }
      return res.status(201).json({ msg: "Delete event success" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
module.exports = eventCtrl;
