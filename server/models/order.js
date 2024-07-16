const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productID: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  customProducts: [
    {
      customProductID: { type: Schema.Types.ObjectId, ref: "CustomOrder" },
      quantity: Number,
      price: Number
    }
  ],
  estimatedDelivery: String,
  date: String,
  time: String,
  total: Number
});

OrderSchema.plugin(deepPopulate);

module.exports = mongoose.model("Order", OrderSchema);