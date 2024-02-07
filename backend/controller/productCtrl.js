const express = require("express");
const Shop = require("../model/ShopModel");
const Order = require("../model/OrderModel");
const Product = require("../model/ProductModel");
const productCtrl = {
  createProduct: async (req, res) => {
    try {
      // console.log(req.body);
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(400).json({ msg: "The Shop is not valid." });
      } else {
        const files = req.files;
        // const imgUrls = files.map((file) => `${file.fileName}`);
        const productData = req.body;
        productData.images = req.body.images;
        productData.shop = shop;
        const product = await Product.create(productData);

        return res.status(201).json({
          product,
        });
      }
    } catch (error) {
      return console.log(error);
    }
  },

  getAllShopProduct: async (req, res) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      res.json(products);
      // return res.status(200).json({ msg: "The email already exists." });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const product = await Product.find({ _id: req.params.id });
      res.json(product);
      // return res.status(200).json({ msg: "The email already exists." });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const allProducts = await Product.find();
      res.json(allProducts);
      // return res.status(200).json({ msg: "The email already exists." });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  deteleShopProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return res.status(400).json({ msg: "The product is not exist" });
      }
      return res.status(201).json({ msg: "Delete product success" });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  updateProductReview: async (req, res) => {
    try {
      const { user, comment, rating, productId, orderId } = req.body;
      const product = await Product.findById(productId);
      const review = { user, rating, comment, productId };
      if (!product) {
        return res.status(400).json({ msg: "The product is not exist" });
      }

      const isReviewedCheck = product.reviews.find(
        (rev) => rev.user._id === user._id
      );
      if (isReviewedCheck) {
        return res
          .status(400)
          .json({ msg: "You are already review for this product!" });
        // product.reviews.forEach((rev)=>{
        //   if(rev.user._id===req.user._id){
        //     rev.rating=rating,rev.comment=comment
        //   }
        // })
      } else {
        product.reviews.push(review);
        const order = await Order.findById(orderId);
        order.isReviewed = true;
        order.save();
      }
      let avg = 0;
      product.reviews.forEach((rev) => (avg += rev.rating));
      product.ratings = avg / product.reviews.length;
      product.save();

      return res.status(200).json({ product });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
module.exports = productCtrl;
