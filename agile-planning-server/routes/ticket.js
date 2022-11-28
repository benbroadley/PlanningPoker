var express = require("express");
var router = express.Router();
var globals = require("../globalvars");

/* GET ticket. */
router.get("/", function (req, res, next) {
  res.send("ticket");
});

router.post("/", function (req, res, next) {
  const session = req.body;
  if (globals.sessions[session.id]) {
    globals.sessions[session.id].ticketId = session.ticketId;
  } else {
    globals.sessions[session.id] = {
      ticketId: session.ticketId,
      users: [session.user],
    };
  }
  res.json(globals.sessions[session.id]);
  globals.sessions.type = "ticket";
  return globals.sendEventsToAll(globals.sessions);
});

module.exports = router;
