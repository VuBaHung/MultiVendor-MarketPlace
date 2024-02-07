const router = require("express").Router();
const userCtrl = require("../controller/userCtrl");
const auth = require("../middleware/auth");
const { upload } = require("../multer");
// upload.single("file"),
router.post("/create-user", userCtrl.createUser);
router.post("/activate", userCtrl.activationUser);
router.post("/login-user", userCtrl.login);
router.get("/logout-user", userCtrl.logout);
router.get("/refresh_token", userCtrl.refreshToken);
router.get("/get-user", auth, userCtrl.getUser); //auth
router.get("/get-user/:id", userCtrl.getUserInfor);
router.put("/update-user-info", userCtrl.updateUser);
router.put("/update-password", auth, userCtrl.updateUserPassword);
router.post("/update-user-address", userCtrl.updateUserAddress);
router.post("/delete-user-address", userCtrl.deleteUserAddress);
module.exports = router;
