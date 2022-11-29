<template>
  <div>
    <div>
      <p>
        <span v-if="alreadyVoted && remainingToVote.length > 0"
          >Please wait.. still waiting for {{ remainingToVote.join(", ") }} to
          estimate.</span
        >
        <span
          v-if="
            !alreadyVoted &&
            remainingToVote.length > 0 &&
            remainingToVote.length < (session.users || []).length
          "
          >Some people have started to vote...</span
        >
      </p>
    </div>

    <div v-if="sessionId && alreadyVoted && remainingToVote.length === 0">
      <p>Results:</p>
      <p v-bind:key="e.user" v-for="e in estimates">
        {{ e.user }}: <span class="btn">{{ e.estimate }}</span>
      </p>
      <p>
        Decision:
        <span v-bind:key="m" v-for="m in mode"
          ><span class="btn">{{ m }}</span>
        </span>
      </p>
    </div>

    <!-- <pre> {{ estimates }} </pre> -->
  </div>
</template>

<script>
import { difference, map, mean } from "lodash";

// function getMode(numbers) {
//   // as result can be bimodal or multi-modal,
//   // the returned result is provided as an array
//   // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
//   var modes = [];
//   var count = [];
//   var i;
//   var number;
//   var maxIndex = 0;

//   numbers = numbers.filter((x) => typeof x === "number");

//   for (i = 0; i < numbers.length; i += 1) {
//     number = numbers[i];
//     count[number] = (count[number] || 0) + 1;
//     if (count[number] > maxIndex) {
//       maxIndex = count[number];
//     }
//   }

//   for (i in count)
//     if (Object.prototype.hasOwnProperty.call(count, i)) {
//       if (count[i] === maxIndex) {
//         modes.push(Number(i));
//       }
//     }

//   return modes;
// }

function getMean(numbers) {
  console.log("numbers: ", numbers);
  if (numbers.length === 0) return [];
  return [Math.round(mean(numbers))];
}

export default {
  name: "EstimateInfo",
  props: {},
  data() {
    return {};
  },
  computed: {
    remainingToVote() {
      return difference(this.session.users || [], map(this.estimates, "user"));
    },
    alreadyVoted() {
      return !!this.estimates.find((element) => element.user === this.username);
    },
    estimates() {
      return this.$store.state.estimates;
    },
    session() {
      return this.$store.state.session;
    },
    sessionId() {
      return this.$store.state.sessionId;
    },
    ticketId() {
      return this.$store.state.ticketId;
    },
    username() {
      return this.$store.state.name;
    },
    mode() {
      let numbers = (map(this.estimates, "estimate") || []).filter(
        (x) => typeof x === "number"
      );
      return getMean(numbers);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  background-color: #42b983;
  color: #ffffff;
  border-radius: 5px;
  font-weight: bolder;
  padding: 10px;
  margin: 4px;
  display: inline;
}
</style>
