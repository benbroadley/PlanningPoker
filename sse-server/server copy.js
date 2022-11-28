const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function eventsHandler(request, response, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(estimates)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

async function addEstimate(request, response, next) {
  const newEstimate = request.body;
  newEstimate.type = "estimate";

  const idx = estimates.findIndex((estimate) => {
    return (
      estimate.user === newEstimate.user &&
      estimate.sessionId === newEstimate.sessionId &&
      estimate.ticketId === newEstimate.ticketId
    );
  });

  if (idx >= 0) {
    estimates[idx] = newEstimate;
  } else {
    estimates.push(newEstimate);
  }
  response.json(newEstimate);
  return sendEventsToAll(newEstimate);
}

async function session(request, response, next) {}

app.get("/events", eventsHandler);
app.post("/estimate", addEstimate);
app.post("/session", session);
