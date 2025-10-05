// routes/chequeRoutes.js
const express = require("express");
const controller = require("../controllers/chequesController");

const router = express.Router();

router.route("/").get(controller.getCheques).post(controller.createCheque);

router
  .route("/:id")
  .get(controller.getCheque)
  .patch(controller.updateCheque)
  .delete(controller.deleteCheque);

module.exports = router;
