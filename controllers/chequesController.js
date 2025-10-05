const catchAsynchError = require("../utils/catchAsynch");
const AppError = require("../utils/ErrorHandling");
const ApiFeatures = require("../utils/ApiFeatures");
const Cheque = require("../models/cheques");

// Create
exports.createCheque = catchAsynchError(async (req, res, next) => {
  const cheque = await Cheque.create(req.body);
  res.status(201).json({
    status: "success",
    data: { cheque },
  });
  next();
});

// Read One
exports.getCheque = catchAsynchError(async (req, res, next) => {
  const cheque = await Cheque.findById(req.params.id);
  if (!cheque) return next(new AppError("Cheque not found", 404));
  res.status(200).json({
    status: "success",
    data: { cheque },
  });
  next();
});

// Read All with features
exports.getCheques = catchAsynchError(async (req, res, next) => {
  const features = new ApiFeatures(Cheque.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const cheques = await features.query;
  res.status(200).json({
    status: "success",
    results: cheques.length,
    data: { cheques },
  });
  next();
});

// Update
exports.updateCheque = catchAsynchError(async (req, res, next) => {
  const cheque = await Cheque.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cheque) return next(new AppError("Cheque not found", 404));
  res.status(200).json({
    status: "success",
    data: { cheque },
  });
  next();
});

// Delete
exports.deleteCheque = catchAsynchError(async (req, res, next) => {
  const cheque = await Cheque.findByIdAndDelete(req.params.id);
  if (!cheque) return next(new AppError("Cheque not found", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
  next();
});
