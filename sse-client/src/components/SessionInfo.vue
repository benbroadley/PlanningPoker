<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div v-if="!sessionId">
      <p>Please create or join a session to continue:</p>
      <p>Name: <input v-model="name" /></p>
      <p>Session id: <input v-model="newSessionId" /></p>
      <p>
        <button v-on:click="newId">New session</button
        ><button v-on:click="overrideId">Join session</button>
      </p>
    </div>
    <div v-if="sessionId">
      <p>
        Hi <strong>{{ username }}</strong
        >, you're currently connected to session:
        <strong>{{ sessionId }}</strong> with
        <strong>{{ (session.users || []).length - 1 }}</strong> other(s).
        <button v-on:click="leaveSession">Leave</button>
      </p>

      <pre>{{ session }}</pre>
      <p>
        <button v-on:click="newTicketId">New ticket</button>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SessionInfo",
  data() {
    return {
      newSessionId: null,
      name: null,
    };
  },
  props: {
    msg: String,
  },
  computed: {
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
  },
  methods: {
    newId() {
      this.$store.dispatch("newId");
      this.$store.dispatch("clearEstimates");
      this.$store.dispatch("setName", { name: this.name });
      const body = {
        id: this.sessionId,
        ticketId: this.ticketId,
        user: this.username,
      };
      axios
        .post("http://localhost:3000/session", body)
        .then((response) => console.log("Created", response.data))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    newTicketId() {
      this.$store.dispatch("newTicketId");
      const body = {
        id: this.sessionId,
        ticketId: this.ticketId,
        user: this.username,
      };
      axios.post("http://localhost:3000/ticket", body).catch((error) => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    overrideId() {
      this.$store.dispatch("newId", { newId: this.newSessionId });
      this.$store.dispatch("clearEstimates");
      this.$store.dispatch("setName", { name: this.name });
      const body = {
        id: this.sessionId,
        ticketId: this.ticketId,
        user: this.username,
      };
      axios
        .post("http://localhost:3000/session", body)
        .then((response) => {
          console.log("Joined", response.data);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    leaveSession() {
      this.$store.dispatch("newSession", {});
      this.$store.dispatch("newId", { clearId: true });
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
</style>
