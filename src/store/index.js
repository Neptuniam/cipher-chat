import { createStore } from "vuex";
import { useStorage } from '@vueuse/core'

const messagesMap = useStorage('messagesMap', {})


const store = createStore({
  state: {
    name: null,
    roomName: null,
    key: null,


    room: {},
    // messages: messagesMap.value[this.roomName] || []
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

      // state.messages.push(room)
    }
  },
  actions:{
    saveNote({ commit }, profile) {

      commit('SAVE_NOTE',title);
    }
  }
});

export default store;
