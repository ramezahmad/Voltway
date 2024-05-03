const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  car_id: {
    type: String,
    unique: true,
  },
  model: String,
  plugType: {
    AC: String,
    DC: String,
    _id: false,
  },
  carImage: String, // Store the file path in the filesystem
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
