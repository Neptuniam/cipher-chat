import { createStore } from "vuex";
import { useStorage } from '@vueuse/core'

const useDarkMode = useStorage('useDarkMode', true)


const store = createStore({
  state: {
    name: null,
    roomName: null,
    key: 'test',


    room: {},
    // messages: messagesMap.value[this.roomName] || []
  },
  getters:{
    getUseDarkMode(state) {
      return useDarkMode.value;
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
    },

    toggleTheme() {
      useDarkMode.value = !useDarkMode.value
    }
  }
});

export default store;
