<template>
  <div v-if="sessionId">
    <span
      class="btn"
      v-bind:key="val"
      v-for="val in possibleValues"
      @click="submitEstimate(val)"
      >{{ val }}</span
    >
  </div>
</template>

<script>
import axios from "axios";
import { find } from "lodash";
import config from "../config";

export default {
  name: "PokerInfo",
  props: {},
  data() {
    return {
      possibleValues: config.pointOptions.default,
    };
  },
  computed: {
    sessionId() {
      return this.$store.state.sessionId;
    },
    ticketId() {
      return this.$store.state.ticketId;
    },
    username() {
      return this.$store.state.name;
    },
    hasVoted() {
      return !!find(this.$store.state.estimates, {
        sessionId: this.sessionId,
        ticketId: this.ticketId,
        user: this.username,
      });
    },
  },

  methods: {
    submitEstimate(estimate) {
      const body = {
        sessionId: this.sessionId,
        ticketId: this.ticketId,
        user: this.username,
        date: new Date(),
        estimate,
      };
      axios.post(`${config.serverURL}/estimate`, body).catch((error) => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.btn {
  background-color: #42b983;
  color: #ffffff;
  border-radius: 5px;
  font-weight: bolder;
  padding: 10px;
  margin: 4px;
  display: inline;
  cursor: pointer;
}
</style>
