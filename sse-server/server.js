const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/status", (request, response) =>
  response.json({ clients: clients.length })
);

const PORT = process.env.PORT || 3001;

let clients = [];
let estimates = [];
let sessions = {};

app.listen(PORT, () => {
  console.log(`Events service listening at http://localhost:${PORT}`);
});

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

function sendEventsToAll(msg) {
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(msg)}\n\n`)
  );
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

async function session(request, response, next) {
  const session = request.body;

  if (!sessions[session.id]) {
    sessions[session.id] = {
      ticketId: session.ticketId,
      users: [session.user],
    };
  } else if (
    sessions[session.id] &&
    !sessions[session.id].users.find((element) => element === session.user)
  ) {
    sessions[session.id].users.push(session.user);
  }
  response.json(sessions[session.id]);
  sessions.type = "session";
  return sendEventsToAll(sessions);
}

async function ticket(request, response, next) {
  const session = request.body;
  if (sessions[session.id]) {
    sessions[session.id].ticketId = session.ticketId;
  } else {
    sessions[session.id] = {
      ticketId: session.ticketId,
      users: [session.user],
    };
  }
  response.json(sessions[session.id]);
  sessions.type = "ticket";
  return sendEventsToAll(sessions);
}

app.get("/events", eventsHandler);
app.post("/estimate", addEstimate);
app.post("/session", session);
app.post("/ticket", ticket);
