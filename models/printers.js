const mongoose = require("mongoose");

const printerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    printerOffset: {
      offsetCheque: {
        offsetXmm: { type: Number, required: true },
        offsetYmm: { type: Number, required: true },
      },
      offsetA4: {
        offsetXmm: { type: Number, required: true },
        offsetYmm: { type: Number, required: true },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("printers", printerSchema);
