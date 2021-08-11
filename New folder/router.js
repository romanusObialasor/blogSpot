const express = require("express");
const model = require("./model");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "userapi",
  api_key: "951792771124655",
  api_secret: "ed4hz_jlb_DktA1oYf2dmN_X3AQ",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb("file format not supported");
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
});

router
  .post("/", upload.single("image"), async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);

    try {
      const newData = await model.create({
        image: result.secure_url,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        title: req.body.title,
        filePath: req.file.path,
        cloud_id: result.public_id,
      });
      res.status(200).json({
        msg: "succefully created 👶",
        data: newData,
      });
    } catch (error) {
      res.status(400).json({
        msg: "error while creating",
        data: error,
      });
    }
  })
  .get("/", async (req, res) => {
    try {
      const newData = await model.find();
      res.status(200).json({
        msg: "succefully found all 👨‍👨‍👦‍👦",
        data: newData,
      });
    } catch (error) {
      res.status(400).json({
        msg: "error while getting all",
        data: error,
      });
    }
  })
  .get("/:id", async (req, res) => {
    try {
      const newData = await model.findById(req.params.id);
      res.status(200).json({
        msg: "succefully found single 👦",
        data: newData,
      });
    } catch (error) {
      res.status(400).json({
        msg: "error while getting an item",
        data: error,
      });
    }
  })
  .delete("/:id", async (req, res) => {
    try {
      const findID = await model.findById(req.params.id);
      if (findID) {
        await cloudinary.uploader.destroy(findID.cloud_id);
      }
      const newData = await model.findByIdAndRemove(req.params.id, req.body);
      res.status(200).json({
        msg: "succefully deleted single 👦",
        data: newData,
      });
    } catch (error) {
      res.status(400).json({
        msg: "error while getting an item",
        data: error,
      });
    }
  })
  .patch("/:id", async (req, res) => {
    const findID = await model.findById(req.params.id);
    const value = {
      image: result.secure_url,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      filePath: req.file.path,
      cloud_id: result.public_id,
    };
    if (findID) {
      await cloudinary.uploader.destroy(findID.cloud_id);
    }
    const newData = await model.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    res.json({ data: newData, msg: "updated" });
  });

//

module.exports = router;
