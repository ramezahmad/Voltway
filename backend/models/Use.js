const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const useSchema = new Schema({
  customerUseId: String,
  carUseId: String,
});
const Use = mongoose.model("Use", useSchema);

module.exports = Use;
