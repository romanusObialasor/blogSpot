const express = require("express");
const model = require("./model");
const multer = require("multer");
const path = require("path");
const router = express.Router();
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
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb("fileFormat unsupported");
  }
};

const uploady = multer({
  storage: storage,
  fileFilter,
});

router.post("/", uploady.single("image"), async (req, res) => {
  const output = await cloudinary.uploader.upload(req.file.path);
  const body = {
    author: req.body.author,
    title: req.body.title,
    tag: req.body.tag,
    description: req.body.description,
    image: output.secure_url,
    filePath: req.file.path,
    cloud_id: output.public_id,
  };

  try {
    const newData = await model.create(body);
    res.status(200).json({
      msg: "created",
      data: newData,
    });
  } catch (error) {
    res.status(404).json({
      msg: "erro while creating",
      data: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getSingle = await model.findById(req.params.id);
    res.status(200).json({
      msg: "found single",
      data: getSingle,
    });
  } catch (error) {
    res.status(404).json({
      msg: "erro fetching a single data",
      data: error,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const getAll = await model.find();
    res.status(200).json({
      msg: "found all",
      data: getAll,
    });
  } catch (error) {
    res.status(404).json({
      msg: "erro fetching All",
      data: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await model.findById(req.params.id);
    if (result) {
      cloudinary.uploader.destroy(result.cloud_id);
    }

    const deleteData = await model.findByIdAndRemove(req.params.id, req.body);
    res.status(200).json({
      msg: "Deleted",
      data: deleteData,
    });
  } catch (error) {
    res.status(404).json({
      msg: "Deleted",
      data: error,
    });
  }
});

module.exports = router;
