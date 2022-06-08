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
</script>

<template>
  <enter-room v-if="!name || !key" />
  <chat-room v-else />
</template>

<style>
html {
  overflow-y: hidden !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
