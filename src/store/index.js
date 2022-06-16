import { createStore } from "vuex";

const store = createStore({
  state: {
    name: null,
    roomName: null,
    key: null,


    room: {}
  },
  getters:{
    totalNotes(state) {
      return state.notes.length;
    }
  },
  mutations:{
    SAVE_PROFILE(state, profile) {
      const { name, roomName, key } = profile

      state.name = name
      state.roomName = roomName
      state.key = key
    },

    SET_ROOM_INFO(state, room) {
      state.room.room = room.room
      state.room.users = room.users
      state.room.count = room.total_users

      state.messages.push(room)
    }
  },
  actions:{
    saveNote({ commit }, profile) {

      commit('SAVE_NOTE',title);
    }
  }
});

export default store;
