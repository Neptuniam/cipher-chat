<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import EnterRoom from "./views/EnterRoom.vue"
import ChatRoom from "./views/ChatRoom.vue"

import { useStore } from "vuex"
import { computed } from "vue"

const store = useStore()

const name = computed(() => store.state.name)
const key = computed(() => store.state.key)
const getUseDarkMode = computed(() => store.getters.getUseDarkMode)

const urlSearchParams = new URLSearchParams(window.location.search)
const params = Object.fromEntries(urlSearchParams.entries())

if (params.room != null) {
  store.commit("SAVE_PROFILE", {
    roomName: params.room,
  })
}
</script>

<template>
  <v-theme-provider :theme="getUseDarkMode ? 'dark' : 'light'" with-background>
    <enter-room v-if="!name || !key" />
    <chat-room v-else />
  </v-theme-provider>
</template>

<style>
.v-theme-provider {
  height: 100vh;
  width: 100vw;
  color: #9ca3af;
  /* background-color: rgb(17 24 39); */
  overflow-y: hidden !important;
}
html {
  height: 100vh;
  width: 100vw;
  overflow-y: hidden !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.fullWidth {
  width: 100%;
}

.clickable {
  cursor: pointer;
}
</style>
