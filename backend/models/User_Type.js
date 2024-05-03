const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const user_typeSchema = new Schema({
  user_id: String,
  password: String,
  userType: String,
});
user_typeSchema.plugin(autopopulate);
const User_Type = mongoose.model("User_Type", user_typeSchema);

module.exports = User_Type;
