let sessions = {};
let estimates = [];
let clients = [];

function sendEventsToAll(msg) {
  try {
    clients.forEach((client) => {
      client.res.write(`data: ${JSON.stringify(msg)}\n\n`);
    });
  } catch (err) {
    console.log("err", err);
  }
}

module.exports = {
  sessions,
  estimates,
  clients,
  sendEventsToAll,
};
