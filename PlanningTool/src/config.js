module.exports = {
  serverURL:
    process.env.NODE_ENV == "prod"
      ? "https://agileplanningtools.azurewebsites.net"
      : "http://localhost:3000",
  pointOptions: {
    default: [0, 1, 2, 3, 5, 8, 13, 21, ":shrug:"],
    alternative: [0, 5, 10, 15, 100],
  },
};
