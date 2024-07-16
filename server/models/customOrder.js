const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomOrderSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    strings: String,
    pattern: String,
    color: [
        String
    ],
    price: Number
});


module.exports = mongoose.model("CustomOrder", CustomOrderSchema);