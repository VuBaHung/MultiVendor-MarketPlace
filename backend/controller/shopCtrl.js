const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const fs = require("fs-extra");
const jwt = require("jsonwebtoken");
const Shop = require("../model/ShopModel");
const Order = require("../model/OrderModel");
const sendMail = require("../utils/sendMail");
var path = require("path");
const shopCtrl = {
  createShop: async (req, res, next) => {
    try {
      const { name, phoneNumber, address, zipcode, email, password, avatar } =
        req.body;

      const shopEmail = await Shop.findOne({ email });
      if (shopEmail) {
        return res.status(400).json({ msg: "The email already exists." });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });
      }

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = new Shop({
        name,
        phoneNumber,
        email,
        address,
        zipcode,
        password: passwordHash,
        avatar: avatar,
      });

      const activationToken = createActivationToken(newShop);
      // res.cookie("refreshtoken",refreshToken,{
      //   httpOnly:true,
      //   path:"/user/refresh_token"
      // })
      const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

      try {
        await sendMail({
          email: newShop.email,
          subject: "Activate your Shop",
          message: `Hello ${newShop.name}, please click on the link to activate your account: ${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- ${newShop.email} to activate your account!`,
        });
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
      // -------------------------------
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  activationShop: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const newShop = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SERCRET
      );
      if (!newShop) {
        return res.status(400).json({ msg: "Register  Failure!." });
      }

      const { name, phoneNumber, address, email, password, avatar, zipcode } =
        newShop.newShop;

      let shop = await Shop.findOne({ name });
      if (shop) {
        return res.status(400).json({ msg: "Shop Name already exists." });
      }
      const shopCheck = await Shop.findOne({ email });
      if (shopCheck) {
        return res.status(400).json({ msg: "This email already exists." });
      }
      const createShop = new Shop({
        name,
        phoneNumber,
        email,
        address,
        zipcode,
        password,
        avatar,
      });
      createShop.save();
    } catch (error) {
      console.log(error.message);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const seller = await Shop.findOne({ email });
    if (!seller)
      return res.status(400).json({ msg: "This email is not exist" });

    bcrypt.compare(password, seller.password, (err, isMatch) => {
      if (isMatch) {
        // const accessToken = createAccessToken(seller._id);
        const seller_refreshtoken = createRefreshToken(seller);
        res.cookie("seller_refreshtoken", seller_refreshtoken, {
          httpOnly: true,
          path: "/shop/refresh_token",
        });
        // res.json({ refreshToken });
        res.json({ seller_refreshtoken });
        // res.send({ msg: "Login success" });
      } else {
        return res.status(400).json({ msg: "Password is not correct" });
      }
    });
  },
  logout: async (req, res) => {
    try {
      await res.clearCookie("seller_refreshtoken", {
        path: "/shop/refresh_token",
      });
      return res.json({ msg: "Logged out" });
    } catch (error) {
      return res.status(400).json({ msg: "Logout error!" });
    }
  },
  getSeller: async (req, res) => {
    try {
      // console.log(req.user);
      const seller = await Shop.findById(req.seller.newShop._id).select(
        "-password"
      );
      if (!seller) return res.status(400).json({ msg: "User does not exist" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllShopOrders: async (req, res) => {
    try {
      // res.json(req.seller.newShop._id);
      const orders = await Order.find({
        "cart.shopId": req.seller.newShop._id,
      }).sort({ createdAt: -1 });
      if (!orders) return res.status(400).json({ msg: "No order exist" });
      res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getShopInfor: async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id);
      if (!shop) return res.status(400).json({ msg: "shop does not exist" });
      res.json({
        shop,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateShopInfor: async (req, res) => {
    try {
      const {
        name,
        phoneNumber,
        address,
        zipcode,
        email,
        description,
        avatar,
      } = req.body;
      const shop = await Shop.findById(req.seller.newShop._id);
      if (!shop) return res.status(400).json({ msg: "shop does not exist" });
      shop.name = name;
      shop.phoneNumber = phoneNumber;
      shop.address = address;
      shop.zipcode = zipcode;
      shop.email = email;
      shop.description = description;
      if (avatar) {
        shop.avatar = avatar;
      }
      await shop.save();
      res.json({
        shop,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: async (req, res) => {
    const rfSeller_token = req.cookies.seller_refreshtoken;

    if (!rfSeller_token) {
      return res.status(400).json({ msg: "Please login or register!" });
    }
    jwt.verify(rfSeller_token, process.env.REFRESH_TOKEN, (err, seller) => {
      if (seller) {
        const accessToken = createAccessToken(seller.newShop);
        res.json({ seller, accessToken });
      } else {
        return res.status(400).json({ msg: "Please login or register!" });
      }
    });
  },
};
const createActivationToken = (newShop) => {
  return jwt.sign({ newShop }, process.env.ACTIVATION_SERCRET, {
    expiresIn: "1h",
  });
};

const createRefreshToken = (newShop) => {
  return jwt.sign({ newShop }, process.env.REFRESH_TOKEN, { expiresIn: "1d" });
};

const createAccessToken = (newShop) => {
  return jwt.sign({ newShop }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
};
module.exports = shopCtrl;
