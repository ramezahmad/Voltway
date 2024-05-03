const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chargeSchema = new Schema({
    carChargeId: String,
    stationChargeId: String,
  });
  const Charge = mongoose.model("Charge", chargeSchema);
  
  module.exports = Charge;