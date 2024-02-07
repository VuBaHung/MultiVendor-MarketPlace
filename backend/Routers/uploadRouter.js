const router = require("express").Router();
const cloudinary = require("cloudinary");

const fs = require("fs-extra");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//Upload images
router.post("/uploadImgUser", (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send("no file uploaded");
    const file = req.files.file;

    if (file.size > 1024 * 1024) {
      removeTpm(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large" });
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTpm(file.tempFilePath);
      return res.status(400).json({ msg: "Image format is not compatible" });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "UserImages" },
      (err, result) => {
        if (err) throw err;
        removeTpm(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
  const removeTpm = (path) => {
    fs.remove(path, (err) => {
      if (err) return console.error(err);
    });
  };
});
router.delete("/destroyImgUser", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "No image selected" });
    cloudinary.v2.uploader.destroy(public_id, (err, result) => {
      if (err) throw err;
      res.json({ msg: "Deleted Image" });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
