var express = require("express");
var router = express.Router();
var globals = require("../globalvars");

/* GET */
router.get("/", function (req, res, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const data = `data: ${JSON.stringify(globals.estimates)}\n\n`;
  res.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res: res,
  };

  globals.clients.push(newClient);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    globals.clients = globals.clients.filter(
      (client) => client.id !== clientId
    );
  });
});

module.exports = router;
