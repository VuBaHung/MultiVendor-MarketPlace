const router = require("express").Router();
const cloudinary = require("cloudinary");

const fs = require("fs-extra");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//Upload images
async function uploadMultipleImages(files) {
  try {
    let uploadedImages = [];
    const removeTpm = (path) => {
      fs.remove(path, (err) => {
        if (err) return console.error(err);
      });
    };
    // Map through each file and upload it to Cloudinary
    for (const file of files) {
      //   console.log({ file });
      if (file.size > 1024 * 1024) {
        removeTpm(file.tempFilePath);
        return res.status(400).json({ msg: "Size too large" });
      }

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        removeTpm(file.tempFilePath);
        return res.status(400).json({ msg: "Image format is not compatible" });
      }
      //   const result = await cloudinary.uploader.upload(file.tempFilePath, {
      //     folder: "ProductImages",
      //   });
      const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "ProductImages",
      });
      removeTpm(file.tempFilePath);

      uploadedImages.push(result.url);
    }

    return uploadedImages;
  } catch (error) {
    console.log(error);
  }
}
router.post("/upload", async (req, res) => {
  try {
    const myObject = req.files;

    const valuesArray = Object.values(myObject);
    // console.log(valuesArray);
    // const filesToUpload = req.files.images;
    // console.log({ filesToUpload });
    const uploadedImageURLs = await uploadMultipleImages(valuesArray);

    res.json({ uploadedImages: uploadedImageURLs });
  } catch (error) {
    res.status(500).json({ error: "Error uploading images" });
  }
  //   try {
  //     // console.log(req.files);
  //     const files = req.files.file;
  //     var arrayImg = [];

  //     for (const file of files) {
  //       // if (!req.files || Object.keys(req.files).length === 0)
  //       //   return res.status(400).send("no file uploaded");
  //       //

  //       if (file.size > 1024 * 1024) {
  //         removeTpm(file.tempFilePath);
  //         return res.status(400).json({ msg: "Size too large" });
  //       }

  //       if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
  //         removeTpm(file.tempFilePath);
  //         return res.status(400).json({ msg: "Image format is not compatible" });
  //       }

  //       cloudinary.v2.uploader.upload(
  //         file.tempFilePath,
  //         { folder: "ProductImages" },
  //         (err, result) => {
  //           if (err) throw err;
  //           removeTpm(file.tempFilePath);
  //           //   console.log(result.url);
  //           arrayImg.push(result.url);
  //         //   console.log(arrayImg);
  //           //   return arrayImg;
  //           //   res.json({ public_id: result.public_id, url: result.url });
  //         }
  //       );
  //     }return arrayImg;

  //   } catch (error) {
  //     return res.status(500).json({ msg: error.message });
  //   }
});
router.delete("/destroy", (req, res) => {
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
