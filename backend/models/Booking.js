const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newBooking = new Schema({
  customerBookingId: String,
  stationBookingId: String,
});

const Booking = mongoose.model("Booking",newBooking);

module.exports = Booking;
