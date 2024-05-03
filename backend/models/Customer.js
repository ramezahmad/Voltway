const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  customer_id:{
    type:String,
    unique:true,
  },
  fname: String,
  lname: String,
  email:String,
  phone_no: String,
  feedback_rate:Number,
  user_type:{
    type: Schema.Types.ObjectId,
    ref: 'User_Type',
    autopopulate: true,
  }
});

customerSchema.plugin(autopopulate);
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
