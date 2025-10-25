const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    label: { type: String, required: true },
    value: { type: String, default: "" },
    fieldType: {
      type: String,
      enum: ["text", "number", "date"],
      default: "text",
    },
    fontFamily: { type: String, default: "" },
    fontWeight: { type: String, default: "normal" },
    fontSize: { type: Number, default: 16 },
    mandatory: { type: Boolean, default: false },
    hide: { type: Boolean, default: false },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    size: {
      width: { type: Number, default: 120 },
      height: { type: Number, default: 40 },
    },
  },
  { _id: false }
);

const defaultFields = [
  {
    fieldType: "date",
    id: 1,
    value: "",
    position: { x: 110, y: 110 },
    size: { width: 120, height: 40 },
    fontSize: 16,
    label: "Cheque's date",
    fontWeight: "normal",
    mandatory: true,
  },
  {
    fieldType: "number",
    id: 4,
    fontFamily: "",
    value: "",
    position: { x: 110, y: 110 },
    size: { width: 120, height: 40 },
    fontSize: 16,
    label: "The amount",
    fontWeight: "normal",
    mandatory: true,
  },
  {
    id: 4001,
    hide: true,
    label: "Amount (Currency)",
    fieldType: "number",
    value: "",
    position: { x: 100, y: 100 },
    mandatory: true,
  },
  {
    id: 4002,
    label: "Amount (Words)",
    fieldType: "text",
    size: { width: 220, height: 40 },
    value: "",
    position: { x: 100, y: 150 },
    mandatory: true,
  },
  {
    id: 5,
    label: "And that for",
    fieldType: "text",
    size: { width: 220, height: 40 },
    value: "",
    position: { x: 110, y: 160 },
    mandatory: true,
  },
  {
    id: 6,
    label: "Cheque Writer",
    fieldType: "text",
    size: { width: 220, height: 40 },
    value: "",
    position: { x: 95, y: 160 },
    mandatory: true,
  },
];

const defaultFields2 = [
  {
    fieldType: "date",
    id: 1,
    value: "",
    position: { x: 110, y: 110 },
    size: { width: 120, height: 40 },
    fontSize: 16,
    label: "Cheque's date",
    fontWeight: "normal",
    mandatory: true,
  },
  {
    fieldType: "number",
    id: 4,
    fontFamily: "",
    value: "",
    position: { x: 110, y: 110 },
    size: { width: 120, height: 40 },
    fontSize: 16,
    label: "The amount",
    fontWeight: "normal",
    mandatory: true,
  },
  {
    id: 4001,
    hide: true,
    label: "Amount (Currency)",
    fieldType: "number",
    value: "",
    position: { x: 100, y: 100 },
    mandatory: true,
  },
  {
    id: 4002,
    label: "Amount (Words)",
    fieldType: "text",
    size: { width: 220, height: 40 },
    value: "",
    position: { x: 100, y: 150 },
    mandatory: true,
  },
];

const ChequeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    isCheque: { type: Boolean, default: false }, // 👈 مضاف هنا
    fields: {
      type: [FieldSchema],
      default: [], // 👈 نخليها فاضية دايمًا
    },
  },
  { timestamps: true }
);

/** 👇 Hook لتوليد الـ defaultFields تلقائيًا لو isCheque === true */
ChequeSchema.pre("save", function (next) {
  if (this.isCheque && (!this.fields || this.fields.length === 0)) {
    console.log(this);
    this.fields = defaultFields;
  } else {
    this.fields = defaultFields2;
  }
  next();
});

module.exports = mongoose.model("Cheque", ChequeSchema);
