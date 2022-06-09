<script setup>
  import { ref } from 'vue'
  import { useStore } from "vuex";

  const store = useStore();
  const name = ref(store.state.name || '')
  const roomName = ref(store.state.roomName || '')
  const key = ref(store.state.key || '')
  const error = ref('')

  function submitForm() {
    error.value = null

    if (!name.value) {
      error.value = 'Name is required'
    } else if (!roomName.value) {
      error.value = 'Room Name is required'
    } else if (!key.value) {
      error.value = 'Encryption Key is required'
    } else {
      store.commit('SAVE_PROFILE', {
        name: name.value,
        roomName: roomName.value,
        key: key.value
      });
    }
  }
</script>

<template>
  <h1>Welcome to Cipher Chat!</h1>

  <h3>Please enter your custom encryption key</h3>

  <input type="text" v-model="name" placeholder="Your username">

  <br>

  <input type="password" v-model="roomName" placeholder="Room name">

  <br>

  <input type="password" v-model="key" placeholder="Encryption Key">

  <br><br>

  <button type="button" name="button" @click="submitForm()">
    Submit
  </button>

  <div id="errorMessage">
    {{ error }}
  </div>
</template>

<style scoped>
  h3 {
    margin-bottom: 40px;
  }

  input {
    width: 300px;
    margin-bottom: 20px;
    padding: 5px;

    font-size: 18px;
  }

  button {
    width: 315px;

    font-size: 18px;
    padding: 10px;

    background-color: #1877F2 !important;
    color: white;
    border-color: silver;

    border-radius: 5px;
  }

  #errorMessage {
    color: red;
  }
</style>
