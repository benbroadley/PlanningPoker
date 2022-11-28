<template>
  <div id="app">
    <h1>Planning poker</h1>
    <SessionInfo />
    <PokerInfo />
    <EstimateInfo />
  </div>
</template>

<script>
import SessionInfo from "./components/SessionInfo.vue";
import PokerInfo from "./components/PokerInfo.vue";
import EstimateInfo from "./components/EstimateInfo.vue";
import { isArray, filter } from "lodash";

export default {
  name: "App",
  components: {
    SessionInfo,
    PokerInfo,
    EstimateInfo,
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
  },
  created() {
    this.$sse
      .create("https://agileplanningtools.azurewebsites.net/events")
      .on("message", (msg) => {
        console.log("MSG", JSON.stringify(msg));
        if (
          msg.type === "estimate" &&
          msg.sessionId === this.sessionId &&
          msg.ticketId === this.ticketId
        ) {
          console.info("Estimate Message:", msg);
          this.$store.dispatch("addNewEstimate", msg);
        } else if (msg.type === "ticket" && msg[this.sessionId]) {
          console.info("Ticket Message:", msg);
          this.$store.dispatch("clearEstimates");
          this.$store.dispatch("newTicketId", {
            newTicketId: msg[this.sessionId].ticketId,
          });
          this.$store.dispatch("newSession", msg[this.sessionId]);
        } else if (msg.type === "session" && msg[this.sessionId]) {
          this.$store.dispatch("newTicketId", {
            newTicketId: msg[this.sessionId].ticketId,
          });
          this.$store.dispatch("newSession", msg[this.sessionId]);
        } else if (isArray(msg)) {
          const estimates = filter(msg, {
            sessionId: this.sessionId,
            ticketId: this.ticketId,
            type: "estimate",
          });
          this.$store.dispatch("repopulateEstimates", { estimates });
        } else {
          console.log("not matched", msg);
        }
      })
      .on("error", (err) =>
        console.error("Failed to parse or lost connection:", err)
      )
      .connect()
      .catch((err) => console.error("Failed make initial connection:", err));
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
