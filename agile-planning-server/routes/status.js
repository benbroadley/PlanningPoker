var express = require("express");
var router = express.Router();
var globals = require("../globalvars");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
    clients: { id: globals.clients[0].id, res: globals.clients[0].res[0] },
    sessions: globals.sessions,
    estimates: globals.estimates,
  });
});

module.exports = router;
