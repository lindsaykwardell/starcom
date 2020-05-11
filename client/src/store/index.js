import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gameId: null,
  },
  mutations: {
    setGameId: (state, gameId) => (state.gameId = gameId),
  },
  actions: {
    updateGameId: ({ commit }, gameId) => commit("setGameId", gameId),
  },
  modules: {},
});
