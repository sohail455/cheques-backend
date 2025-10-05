const catchAsynchError = require('../utils/catchAsynch');
const AppError = require('../utils/ErrorHandling');
const ApiFeatures = require('../utils/ApiFeatures');

exports.DeleteOne = (model) =>
  catchAsynchError(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('can not find this tour', 404));
    }
    res.status(204).json({
      status: 'sucessfully',
      data: {
        data: 'null',
      },
    });
    next();
  });

exports.updateOne = (Model) =>
  catchAsynchError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('can not find this document', 404));
    }
    res.status(200).json({
      status: 'sucess',
      data: {
        data: doc,
      },
    });
    next();
  });

exports.CreateOne = (Model) =>
  catchAsynchError(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'sucessfully',
      dtata: {
        data: doc,
      },
    });
    next();
  });

exports.GetOne = (Model, populateOption) =>
  catchAsynchError(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOption) {
      query = query.populate('reviews');
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError('can not find this document', 404));
    }
    res.status(200).json({
      status: 'sucessfully',
      dtata: {
        doc,
      },
    });
    next();
  });

exports.GetAll = (Model) =>
  catchAsynchError(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new ApiFeatures(Model.find(filter), req.query)
      .sort()
      .pagination()
      .filter()
      .limitFields();
    const doc = await features.query;
    res.status(200).json({
      status: 'sucessfully',
      results: doc.length,
      dtata: {
        data: doc,
      },
    });
    next();
  });
