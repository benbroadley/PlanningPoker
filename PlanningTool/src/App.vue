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
import config from "./config";

let sseClient;

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
  mounted() {
    sseClient = this.$sse.create({
      url: `${config.serverURL}/events`,
      format: "json",
    });

    sseClient.on("test", (msg) => {
      console.log("RECEIVED", JSON.stringify(msg));
    });

    sseClient.on("message", (msg) => {
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
    });

    // Catch any errors (ie. lost connections, etc.)
    sseClient.on("error", (e) => {
      console.error("lost connection or failed to parse!", e);

      // If this error is due to an unexpected disconnection, EventSource will
      // automatically attempt to reconnect indefinitely. You will _not_ need to
      // re-add your handlers.
    });

    sseClient
      .connect()
      .then(() => {
        console.log("We're connected!");
      })
      .catch((err) => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error("Failed to connect to server", err);
      });
  },
  beforeDestroy() {
    // Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    sseClient.disconnect();
    console.log("Destroyed");

    // Alternatively, we could have added the `sse: { cleanup: true }` option to our component,
    // and the SSEManager would have automatically disconnected during beforeDestroy.
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
