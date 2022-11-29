var express = require("express");
var router = express.Router();
var globals = require("../globals");

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

    return req.app.settings.sendEventsToAll(globals.sessions);
  } catch (err) {
    console.log(err);
  }
});

router.post("/leave", function (req, res, next) {
  try {
    const session = req.body;

    if (
      globals.sessions[session.id] &&
      globals.sessions[session.id].users.find(
        (element) => element === session.user
      ) &&
      globals.sessions[session.id].ticketId === session.ticketId
    ) {
      console.log("FOUND");
      var beforeLength = globals.sessions[session.id].users.length;
      console.log("beforeLength: ", beforeLength);

      globals.sessions[session.id].users.splice(
        globals.sessions[session.id].users.find(
          (element) => element === session.user
        ),
        1
      );

      var endLength = globals.sessions[session.id].users.length;
      console.log("endLength: ", endLength);

      if (
        endLength < beforeLength &&
        !globals.sessions[session.id].users.find(
          (element) => element === session.user
        )
      ) {
        console.log("worked");
      }
    }
    res.json(globals.sessions[session.id]);
    globals.sessions.type = "session";

    return req.app.settings.sendEventsToAll(globals.sessions);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
