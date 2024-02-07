const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../model/UserModel");
const fs = require("fs-extra");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
// const ErrorHandler = require(".././utils/ErrorHandler");
const userCtrl = {
  createUser: async (req, res, next) => {
    try {
      const { name, email, password, file } = req.body;
      // console.log(req.body);
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        return res.status(400).json({ msg: "The email already exists." });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });
      }

      // Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: passwordHash,
        avatar: file,
      });

      const activationToken = createActivationToken(newUser);
      // res.cookie("refreshtoken",refreshToken,{
      //   httpOnly:true,
      //   path:"/user/refresh_token"
      // })
      const activationUrl = `http://localhost:3000/activation/${activationToken}`;

      try {
        await sendMail({
          email: newUser.email,
          subject: "Activate your acccount",
          message: `Hello ${newUser.name}, please click on the link to activate your account: ${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- ${newUser.email} to activate your account!`,
        });
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
      // -------------------------------
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //Activation user
  activationUser: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SERCRET
      );
      if (!newUser) {
        return res.status(400).json({ msg: "Register  Failure!." });
      }

      const { name, email, password, avatar } = newUser.newUser;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User is already exists." });
      }
      const userCheck = await User.findOne({ email });
      if (userCheck) {
        return res.status(400).json({ msg: "The email already exists." });
      }
      const createUser = new User({
        name,
        email,
        password,
        avatar,
      });
      await createUser.save();
    } catch (error) {
      console.log(error.message);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "This email is not exist" });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user);
        res.cookie("refreshtoken", refreshToken, {
          httpOnly: true,
          path: "/user/refresh_token",
        });
        // res.json({ accessToken });
        res.send({ msg: "Login success" });
      } else {
        return res.status(400).json({ msg: "Password is not correct" });
      }
    });
  },
  logout: async (req, res) => {
    try {
      await res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (error) {
      return res.status(400).json({ msg: "Logout error!" });
    }
  },
  refreshToken: async (req, res) => {
    // console.log(req.cookies);
    const rf_token = req.cookies.refreshtoken;

    if (!rf_token) {
      return res.status(400).json({ msg: "Please login or register!" });
    }
    jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
      if (user) {
        const accessToken = createAccessToken(user.newUser);
        res.json({ user, accessToken });
      } else {
        return res.status(400).json({ msg: "Please login or register!" });
      }
    });
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.newUser._id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      res.json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      res.json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, phoneNumber, email, password, images } = req.body;

      const user = await User.findOne({
        email: email,
      }).select("+password");
      if (!user) return res.status(400).json({ msg: "User not found" });
      bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (isMatch) {
          user.email = email;
          user.phoneNumber = phoneNumber;
          user.name = name;
          if (images) {
            user.avatar = images.url;
          }

          await user.save();
          res.status(201).json({
            success: true,
            user,
          });
        } else {
          res.json({ msg: "Your password is not correct" });
        }
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      // console.log({ "req.user": req.user });
      // console.log(req.body);
      const user = await User.findById(req.user.newUser._id);
      const { oldPassword, newPassword, confirmPassword } = req.body;
      if (!user) return res.status(400).json({ msg: "User not found" });
      bcrypt.compare(oldPassword, user.password, async (err, isMatch) => {
        if (isMatch) {
          if (newPassword === confirmPassword) {
            const updatePassword = await bcrypt.hash(newPassword, 10);
            user.password = updatePassword;
            await user.save();
            res.status(201).json({
              msg: "Update your password success!",
              user,
            });
          } else {
            res.status(400).json({
              msg: "New password and confirm password must be the same!",
            });
          }
        } else {
          res.status(400).json({ msg: "Your password is not correct" });
        }
      });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  },
  updateUserAddress: async (req, res) => {
    try {
      const user = await User.findById(req.body.id);

      if (!user) return res.status(400).json({ msg: "User not found" });

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return res.json(`${req.body.addressType} address already exists`);
      }
      const duplicatedAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );
      if (duplicatedAddress) {
        Object.assign(duplicatedAddress, req.body);
      } else {
        user.addresses.push(req.body);
      }
      // console.log(req.body);
      // console.log(user.addresses);
      await user.save();
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteUserAddress: async (req, res) => {
    try {
      const User_address = req.body.address1;

      await User.updateOne(
        {
          _id: req.body.userId,
        },
        {
          $pull: { addresses: { address1: User_address } },
        }
      );
      const user = await User.findById(req.body.userId);
      // await user.save();
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createActivationToken = (newUser) => {
  return jwt.sign({ newUser }, process.env.ACTIVATION_SERCRET, {
    expiresIn: "1h",
  });
};

const createRefreshToken = (newUser) => {
  return jwt.sign({ newUser }, process.env.REFRESH_TOKEN, { expiresIn: "1d" });
};

const createAccessToken = (newUser) => {
  return jwt.sign({ newUser }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
};
module.exports = userCtrl;
