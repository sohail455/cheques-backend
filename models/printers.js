const mongoose = require("mongoose");

const printerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    offset: {
      offsetXmm: { type: Number, required: true },
      offsetYmm: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("printers", printerSchema);
