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
        <span v-bind:key="m" v-for="m in decisions"
          ><span class="btn">{{ m }}</span>
        </span>
      </p>
    </div>

    <!-- <pre> {{ estimates }} </pre> -->
    <pre> {{ session }} </pre>
  </div>
</template>

<script>
import { difference, map } from "lodash";
import config from "../config";

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
    decisions() {
      let numbers = (map(this.estimates, "estimate") || []).filter(
        (x) => typeof x === "number"
      );

      if (!this.session || !this.session.config)
        return config.decisionMethod["mean"](numbers);

      return config.decisionMethod[this.session.config.decisionMethod](numbers);
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
