const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const payementCtrl = {
  paymentProcess: async (req, res) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "VND",
      metadata: {
        company: "Thesis",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  },
  stripeApiKey: async (req, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  },
};
module.exports = payementCtrl;
