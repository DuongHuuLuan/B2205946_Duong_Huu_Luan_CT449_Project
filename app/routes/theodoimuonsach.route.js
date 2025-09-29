const express = require("express");
const tdms = require("../controllers/theodoimuonsach.controller");

const router = express.Router();

router.route("/")
  .get(tdms.findAll)
  .post(tdms.create)
  .delete(tdms.deleteAll);

router.route("/:id")
  .get(tdms.findOne)
  .put(tdms.update)
  .delete(tdms.delete);

module.exports = router;
