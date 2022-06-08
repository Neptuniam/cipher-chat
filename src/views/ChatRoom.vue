<script setup>
  import MessageDisplay from '../components/chatRoom/MessageDisplay.vue'

  import { useStore } from "vuex";
  import { computed, ref } from "vue";
  import { getKey, encryption } from '../services/util.translate.js'

  const store = useStore();

  const name = ref(store.state.name);
  const key = ref(store.state.key);
  const messages = computed(() => store.state.messages);

  const newMessage = ref('')


  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  // Send text to all users through the server
  function sendText(message) {
    if (!message) {
      alert('Please type a message')
      return
    }

    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var msg = {
      type: 'message',
      author: encryption(name.value),
      text: encryption(message),
      id:   clientID,
      date: Date.now()
    };

    // Send the msg object as a JSON-formatted string.
    webSocket.send(JSON.stringify(msg));

    store.commit('ADD_MESSAGE', msg)
  }

  function closeSocket() {
    webSocket.close();
  }

  async function submitMessage() {
    await sendText(newMessage.value)
    newMessage.value = null
    scrollToBottom()
  }

  function scrollToBottom() {
    let messengersContainer = document.getElementById("messengersContainer");

    if (!!messengersContainer)
      messengersContainer.scroll({
        top: messengersContainer.scrollHeight,
        behavior: 'smooth'
      })
  }

  getKey(key.value)
  const clientID = uuidv4()
  const webSocket = new WebSocket(`wss://apps.carterbourette.ca/chat/${clientID}`);

  webSocket.onopen = function(evt) {
    console.log("***ONOPEN");
    webSocket.send('5209ac21-2004-4f17-bdf4-b2e66d4ce50f');
  };

  webSocket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
  };

  webSocket.onmessage = async function (event) {
    const _json = JSON.parse(event.data)

    if (_json && _json.author != name) {
      await store.commit('ADD_MESSAGE', _json)
      scrollToBottom()
    }
  }
</script>

<template>
  <h1>Welcome, {{ name }}</h1>

  <div id="messengersContainer">
    <template v-for="message in messages">
      <message-display :message="message" />
    </template>
  </div>

  <div id="inputRow">
    <textarea rows="3" type="text" placeholder="New Message" v-model="newMessage" @keyup.enter="submitMessage()" />

    <button type="button" name="button" @click="submitMessage">
      SEND
    </button>
  </div>
</template>

<style scoped>
  #messengersContainer, #inputRow {
    width: 1000px;
    max-width: 100%;
    margin: auto;
  }
  #messengersContainer {
    height: calc(100vh - 37px - 72px - 75px);
    overflow-y: auto;
    scroll-behavior: smooth;

    position: relative;
  }

  #inputRow {
    margin-top: 15px;
    height: 75px !important;
  }
  #inputRow textarea {
    font-size: 18px;
    width: calc(100% - 120px);
    padding: 5px;
  }
  #inputRow button {
    width: 100px;
    height: 78px;

    position: relative;
    top: -34px;
  }
</style>
