<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import EnterRoom from './views/EnterRoom.vue'
import ChatRoom from './views/ChatRoom.vue'


import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const name = computed(() => store.state.name);
const key = computed(() => store.state.key);
const getUseDarkMode = computed(() => store.getters.getUseDarkMode);


const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (params.room != null) {
  store.commit('SAVE_PROFILE', {
    roomName: params.room
  });
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

  .v-theme--dark {
    /* --v-theme-background: 17 24 39 !important;
    --v-theme-surface: 17 24 39 / 1.5 !important; */
  }

  /* label {
    font-size: 14px;
    font-weight: 600;
    display: block;
  }
  input, textarea {
    color: rgb(200, 200, 200);
    font-size: 16px;
    line-height: 28px;
    padding: 8px 16px;
    width: calc(100% - 32px);
    border: unset;
    border-radius: 4px;
    background-color: rgb(17 24 39);
    outline: grey solid 1px;
  }

  button {
    font-size: 18px;
    padding: 10px;

    color: rgb(220, 220, 220);

    width: 100%;
    border-radius: 5px;

    background-color: rgb(192 132 252/0.5);
    font-weight: 600;
    cursor: pointer;
  } */
</style>
