var express = require("express");
var router = express.Router();
var globals = require("../globalvars");

/* GET session. */
router.get("/", function (req, res, next) {
  res.send("session");
});

router.post("/", function (req, res, next) {
  try {
    const session = req.body;

    if (!globals.sessions[session.id]) {
      globals.sessions[session.id] = {
        ticketId: session.ticketId,
        users: [session.user],
      };
    } else if (
      globals.sessions[session.id] &&
      !globals.sessions[session.id].users.find(
        (element) => element === session.user
      )
    ) {
      globals.sessions[session.id].users.push(session.user);
    }
    res.json(globals.sessions[session.id]);
    globals.sessions.type = "session";

    return globals.sendEventsToAll(globals.sessions);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
