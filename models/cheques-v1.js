const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false }
);

const ChequeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    positions: {
      type: Map,
      of: PositionSchema,
      default: {},
    },
  },
  { timestamps: true }
);

// بديل 2) باستخدام Object بسيط بدل Map
// const ChequeSchema = new mongoose.Schema({
//   name: String,
//   photo: String,
//   width: Number,
//   height: Number,
//   positions: {
//     type: Object, // { "1": {x,y}, "4002": {x,y} }
//     default: {}
//   }
// }, { timestamps: true });

module.exports = mongoose.model("Cheque", ChequeSchema);
