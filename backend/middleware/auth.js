const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(400).json({ msg: "Authentication is not valid!" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
      if (error) {
        return res.status(400).json({ msg: "Authentication is not valid!" });
      }
      req.user = user;
      // console.log({ user });
      next();
    });
  } catch (error) {
    return res.status(400).json({ msg: error.response.data.message });
  }
};

module.exports = auth;
