const mongoose = require("mongoose");

const model = mongoose.Schema(
  {
    userName: {
      type: String,
      default: "Romanus",
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userCLT", model);
