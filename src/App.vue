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


label {
  font-size: 14px;
  font-weight: 600;
  display: block;
}
input, textarea {
  font-size: 16px;
  line-height: 28px;
  padding: 8px 16px;
  width: calc(100% - 32px);
  /* min-height: 44px; */
  border: unset;
  border-radius: 4px;
  outline-color: rgb(84 105 212 / 0.5);
  background-color: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px;
}

button {
  font-size: 18px;
  padding: 10px;

  /* background-color: #1877F2 !important; */
  color: white;
  /* border-color: silver; */

  width: 100%;
  border-radius: 5px;

  background-color: rgb(84, 105, 212);
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(84 105 212) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
</style>
