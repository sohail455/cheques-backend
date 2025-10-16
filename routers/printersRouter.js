const express = require("express");
const controller = require("../controllers/printersController");

const router = express.Router();

router.route("/").get(controller.getPrinters).post(controller.createPrinter);

router
  .route("/:id")
  .get(controller.getPrinter)
  .patch(controller.updatePrinter)
  .delete(controller.deletePrinter);

module.exports = router;
