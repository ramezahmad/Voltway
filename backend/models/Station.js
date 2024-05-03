const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  station_id: {
    type: String,
    unique: true,
  },
  name: String,
  email: String,
  phone_no:String,
  chargePointsNumber: Number,
  feedback_rate: Number,
  plugTypes: [
    {
      AC: String,
      DC: String,
      _id: false,
    },
  ],
  location: {
    type: {
      type: String,
      enum: "Point",
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
    },
  },
  user_type: {
    type: Schema.Types.ObjectId,
    ref: "User_Type",
    autopopulate: true,
  },
});

stationSchema.plugin(autopopulate);
stationSchema.index({ location: "2dsphere" }); // Create a 2dsphere index on the location field

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
