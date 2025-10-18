const catchAsynchError = require("../utils/catchAsynch");
const AppError = require("../utils/ErrorHandling");
const ApiFeatures = require("../utils/ApiFeatures");
const printers = require("../models/printers");

// Create
exports.createPrinter = catchAsynchError(async (req, res, next) => {
  const printer = await printers.create(req.body);
  res.status(201).json({
    status: "success",
    data: { printer },
  });
});

// Read One
exports.getPrinter = catchAsynchError(async (req, res, next) => {
  const printer = await printers.findById(req.params.id);
  if (!printer) return next(new AppError("printer not found", 404));
  res.status(200).json({
    status: "success",
    data: { printer },
  });
});

// Read All with features
exports.getPrinters = catchAsynchError(async (req, res, next) => {
  const features = new ApiFeatures(printers.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const printerList = await features.query;
  res.status(200).json({
    status: "success",
    results: printerList.length,
    data: { printerList },
  });
});

// Update
exports.updatePrinter = catchAsynchError(async (req, res, next) => {
  const printer = await printers.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!printer) return next(new AppError("printer not found", 404));
  res.status(200).json({
    status: "success",
    data: { printer },
  });
});

// Delete
exports.deletePrinter = catchAsynchError(async (req, res, next) => {
  const printer = await printers.findByIdAndDelete(req.params.id);
  if (!printer) return next(new AppError("printer not found", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
