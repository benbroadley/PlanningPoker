const _ = require("lodash");

module.exports = {
  serverURL:
    process.env.NODE_ENV == "prod"
      ? "https://agileplanningtools.azurewebsites.net"
      : "http://localhost:3000",
  pointOptions: {
    default: [0, 1, 2, 3, 5, 8, 13, 21, ":shrug:"],
    fibonacciExtended: [0, 1, 2, 3, 5, 8, 13, 20, 40, 100],
    alternative: [0, 5, 10, 15, 100],
  },
  decisionMethod: {
    mean: (numbers) => {
      if (numbers.length === 0) return [];
      return [Math.round(_.mean(numbers))];
    },
    mode: (numbers) => {
      //   // as result can be bimodal or multi-modal,
      //   // the returned result is provided as an array
      //   // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
      var modes = [];
      var count = [];
      var i;
      var number;
      var maxIndex = 0;

      numbers = numbers.filter((x) => typeof x === "number");

      for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
          maxIndex = count[number];
        }
      }

      for (i in count)
        if (Object.prototype.hasOwnProperty.call(count, i)) {
          if (count[i] === maxIndex) {
            modes.push(Number(i));
          }
        }

      return modes;
    },
  },
};
