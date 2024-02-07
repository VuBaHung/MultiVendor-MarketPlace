const express = require("express");
require("dotenv").config();
let cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRouter = require("./Routers/userRouter");
const shopRouter = require("./Routers/shopRouter");
const productRouter = require("./Routers/productRouter");
const eventRouter = require("./Routers/eventRouter");
const couponRouter = require("./Routers/couponRouter");
const uploadRouter = require("./Routers/uploadRouter");
const uploadProductRouter = require("./Routers/uploadProductRouter");
const paymentRouter = require("./Routers/paymentRouter");
const orderRouter = require("./Routers/orderRouter");
const chatRouter = require("./Routers/chatRouter");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileUpload({ useTempFiles: true }));
// app.use("/", express.static("uploads"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Router
app.use("/user", userRouter, uploadRouter);
app.use("/shop", shopRouter);
app.use("/product", productRouter, uploadProductRouter);
app.use("/event", eventRouter);
app.use("/coupon", couponRouter);
app.use("/payment", paymentRouter, orderRouter);
app.use("/chat", chatRouter);

//////////////

module.exports = app;
