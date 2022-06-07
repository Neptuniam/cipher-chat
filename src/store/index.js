import { createStore } from "vuex";

const store = createStore({
  state: {
    name: null,
    key: null,

    messages: []
  },
  getters:{
    totalNotes(state) {
      return state.notes.length;
    }
  },
  mutations:{
    SAVE_PROFILE(state, profile) {
      const { name, key } = profile

      state.name = name
      state.key = key
    },

    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    }
  },
  actions:{
    saveNote({ commit }, profile) {
      commit('SAVE_NOTE',title);
    }
  }
});

export default store;
