<script setup>
  import { ref } from 'vue'
  import { useStore } from "vuex";
  import { useStorage } from '@vueuse/core'

  const store = useStore();
  const name = useStorage('name', '')
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

  <form>
    <v-text-field
      label="Your username"
      variant="outlined"
      v-model="name"
      @keyup.enter="submitForm()"
    />

    <v-text-field
      label="Room Name"
      variant="outlined"
      v-model="roomName"
      @keyup.enter="submitForm()"
    />

    <v-text-field
      label="Encryption Key"
      variant="outlined"
      v-model="key"
      @keyup.enter="submitForm()"
    />

    <br>

    <v-btn color="primary" class="fullWidth" @click="submitForm()">
      Submit
    </v-btn>
  </form>

  <div id="errorMessage">
    {{ error }}
  </div>
</template>

<style scoped>
  h1 {
    margin-top: 10px;
  }
  h3 {
    margin-bottom: 40px;
  }

  form {
    text-align: left;
    width: 300px;
    max-width: 100%;
    margin: auto;
  }
  form button {
    height: 50px !important;
  }

  #errorMessage {
    color: red;
    margin-top: 40px;
  }
</style>
