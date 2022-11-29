var express = require("express");
var router = express.Router();
var globals = require("../globals");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
    sessions: globals.sessions,
    estimates: globals.estimates,
  });
});

module.exports = router;
