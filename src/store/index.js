import { createStore } from "vuex"
import { useStorage } from "@vueuse/core"

const messagesMap = useStorage("messagesMap", {})
const useDarkMode = useStorage("useDarkMode", true)

const store = createStore({
  state: {
    name: null,
    roomName: null,
    key: "test",
    room: {},
  },
  getters: {
    getMessages(state) {
      return messagesMap.value[state.roomName] || []
    },

    getUseDarkMode() {
      return useDarkMode.value
    },
  },
  mutations: {
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
    },
    PUSH_MESSAGE(state, message) {
      let _messages = messagesMap.value[state.roomName] || []

      _messages.push(message)

      messagesMap.value[state.roomName] = _messages
    },
    CLEAR_CHAT(state) {
      messagesMap.value[state.roomName] = []
    },
  },
  actions: {
    toggleTheme() {
      useDarkMode.value = !useDarkMode.value
    },
  },
})

export default store
