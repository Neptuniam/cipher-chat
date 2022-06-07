<script setup>
  import { ref } from 'vue'
  import { useStore } from "vuex";

  const store = useStore();
  const name = ref(store.state.name || '')
  const key = ref(store.state.key || '')
  const error = ref('')

  function submitForm() {
    error.value = null

    if (!name.value) {
      error.value = 'Name is required'
    } else if (!key.value) {
      error.value = 'Encryption Key is required'
    } else {
      store.commit('SAVE_PROFILE', {
        name: name.value,
        key: key.value
      });
    }
  }
</script>

<template>
  <h1>Welcome to Chat Encrypt</h1>

  <h3>Please enter your custom encryption key</h3>

  <input type="text" v-model="name" placeholder="Your username">

  <br>

  <input type="text" v-model="key" placeholder="Encryption Key">

  <br><br>

  <button type="button" name="button" @click="submitForm()">
    Submit
  </button>

  <div id="errorMessage">
    {{ error }}
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

#errorMessage {
  color: red;
}
</style>
