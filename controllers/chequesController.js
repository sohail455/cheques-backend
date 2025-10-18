const catchAsynchError = require("../utils/catchAsynch");
const AppError = require("../utils/ErrorHandling");
const ApiFeatures = require("../utils/ApiFeatures");
const Cheque = require("../models/cheques");
const PUBLIC_PREFIX = "/images/cheques";
const path = require("path");
exports.createCheque = catchAsynchError(async (req, res, next) => {
  console.log("createCheque incoming:", {
    body: req.body,
    file: req.file && req.file.fieldname,
  });

  const body = { ...req.body };

  if (req.file) {
    try {
      body.photo = path.posix.join(PUBLIC_PREFIX, req.file.filename);
    } catch (e) {
      console.error("join photo path failed:", e);
      return next(new AppError("Photo path failed", 500));
    }
  }

  // if (body.width != null) {
  //   const w = Number(body.width);
  //   if (Number.isNaN(w))
  //     return next(new AppError("width must be a number", 400));
  //   body.width = w;
  // }
  // if (body.height != null) {
  //   const h = Number(body.height);
  //   if (Number.isNaN(h))
  //     return next(new AppError("height must be a number", 400));
  //   body.height = h;
  // }
  const w = Number(body.width);
  body.width = w;
  const h = Number(body.height);
  body.height = h;

  if (typeof body.positions === "string") {
    try {
      body.positions = JSON.parse(body.positions);
    } catch (e) {
      return next(new AppError("positions must be valid JSON", 400));
    }
  }

  if (!body.name || body.name.trim() === "") {
    return next(new AppError("name is required", 400));
  }
  if (typeof body.width !== "number" || typeof body.height !== "number") {
    return next(new AppError("width and height are required numbers", 400));
  }

  console.log("createCheque pre-insert:", body);

  const cheque = await Cheque.create(body);

  return res.status(201).json({ status: "success", data: { cheque } });
});
// Create
// exports.createCheque = catchAsynchError(async (req, res, next) => {
//   const cheque = await Cheque.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: { cheque },
//   });

// });

// Read One
exports.getCheque = catchAsynchError(async (req, res, next) => {
  const cheque = await Cheque.findById(req.params.id);
  if (!cheque) return next(new AppError("Cheque not found", 404));
  res.status(200).json({
    status: "success",
    data: { cheque },
  });
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
});

// Delete
exports.deleteCheque = catchAsynchError(async (req, res, next) => {
  const cheque = await Cheque.findByIdAndDelete(req.params.id);
  if (!cheque) return next(new AppError("Cheque not found", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
