var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

let clients = [];

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var estimateRouter = require("./routes/estimate");
var sessionRouter = require("./routes/session");
var statusRouter = require("./routes/status");
var ticketRouter = require("./routes/ticket");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/estimate", estimateRouter);
app.use("/session", sessionRouter);
app.use("/status", statusRouter);
app.use("/ticket", ticketRouter);

app.get("/events", function (req, res, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const clientId = Date.now();

  clients.push({
    id: clientId,
    res,
  });

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.set("sendEventsToAll", function (msg) {
  try {
    clients.forEach((client) => {
      client.res.write("event: test");
      client.res.write("\n");

      client.res.write(`data: ${JSON.stringify({ someKey: "value" })}`);
      client.res.write("\n\n");

      client.res.write("event: message\n");
      client.res.write(`data: ${JSON.stringify(msg)}`);
      client.res.write("\n\n");
    });
  } catch (err) {
    console.log("err", err);
  }
});

module.exports = app;
