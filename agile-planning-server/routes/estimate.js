var express = require("express");
var router = express.Router();
var globals = require("../globals");

/* GET estimate. */
router.get("/", function (req, res, next) {
  return res.send("estimate");
});

router.post("/", function (req, res, next) {
  const newEstimate = req.body;
  newEstimate.type = "estimate";

  const idx = globals.estimates.findIndex((estimate) => {
    return (
      estimate.user === newEstimate.user &&
      estimate.sessionId === newEstimate.sessionId &&
      estimate.ticketId === newEstimate.ticketId
    );
  });

  if (idx >= 0) {
    globals.estimates[idx] = newEstimate;
  } else {
    globals.estimates.push(newEstimate);
  }
  res.json(newEstimate);
  return req.app.settings.sendEventsToAll(newEstimate);
});

module.exports = router;
