const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appSchema = new Schema(
  {
    appName: String,
    packageName: String,
    appLogo: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AddApp", appSchema);