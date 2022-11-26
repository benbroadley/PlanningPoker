import Vue from "vue";
import App from "./App.vue";
import Vuex from "vuex";
import { nanoid } from "nanoid";
import VueSSE from "vue-sse";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    session: {},
    sessionId: null,
    name: null,
    ticketId: nanoid(9),
    estimates: [],
  },
  mutations: {
    newId(state, payload) {
      state.sessionId = payload.newId;
    },
    newTicketId(state, payload) {
      state.ticketId = payload.newTicketId;
    },
    newSession(state, payload) {
      state.session = payload;
    },
    newName(state, payload) {
      state.name = payload.name;
    },
    newEstimate(state, payload) {
      const idx = state.estimates.findIndex((estimate) => {
        return (
          estimate.user === payload.user &&
          estimate.sessionId === payload.sessionId &&
          estimate.ticketId === payload.ticketId
        );
      });

      if (idx >= 0) {
        state.estimates.splice(idx, 1);
      }
      state.estimates.push(payload);
    },
    repopulateEstimates(state, payload) {
      state.estimates = payload;
    },
    clearEstimates(state) {
      state.estimates = [];
    },
  },
  actions: {
    newId({ commit }, payload) {
      if (!payload) payload = {};
      if (payload.clearId) {
        payload.newId = null;
      } else {
        payload.newId = payload.newId || nanoid(8);
      }
      commit("newId", payload);
    },
    newTicketId({ commit }, payload) {
      if (!payload) payload = {};
      payload.newTicketId = payload.newTicketId || nanoid(8);
      commit("newTicketId", payload);
    },
    newSession({ commit }, payload) {
      if (!payload) payload = {};
      commit("newSession", payload);
    },
    setName({ commit }, payload) {
      if (!payload) payload = {};
      payload.name = payload.name || `NewUser${nanoid(5)}`;
      commit("newName", payload);
    },
    addNewEstimate({ commit }, payload) {
      if (!payload) payload = {};
      commit("newEstimate", payload);
    },
    clearEstimates({ commit }) {
      commit("clearEstimates");
    },
    repopulateEstimates({ commit }, payload) {
      if (!payload) payload = {};
      commit("repopulateEstimates", payload.estimates || []);
    },
  },
});

Vue.config.productionTip = false;

Vue.use(VueSSE, {
  format: "json",
  polyfill: true,
  url: "http://localhost:3001/events",
});

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
