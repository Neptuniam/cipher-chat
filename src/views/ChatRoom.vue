<script setup>
  import MessageDisplay from '../components/chatRoom/MessageDisplay.vue'

  import { useStore } from "vuex";
  import { computed, ref, onUnmounted } from "vue";
  import { getKey, encryption } from '../services/util.translate.js'

  import { useWebNotification, useFocus, useIdle } from '@vueuse/core'


  const store = useStore();

  const room = ref(store.state.room);

  const name = ref(store.state.name);
  const roomName = ref(store.state.roomName);
  const key = ref(store.state.key);
  const messages = computed(() => store.state.messages);

  const newMessage = ref('')
  const { idle, lastActive } = useIdle(5000) // 5 min


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
    if (!!newMessage.value) {
      await sendText(newMessage.value)
      newMessage.value = null
      scrollToBottom()
    }
  }

  function scrollToBottom() {
    let messengersContainer = document.getElementById("messengersContainer");

    if (!!messengersContainer)
      messengersContainer.scroll({
        top: messengersContainer.scrollHeight,
        behavior: 'smooth'
      })
  }

  let webSocket
  function initConnection() {
    webSocket = new WebSocket(`wss://apps.carterbourette.ca/chat/rooms/${roomName.value}/users/${name.value}`);

    webSocket.onopen = function(evt) {
      webSocket.send('5209ac21-2004-4f17-bdf4-b2e66d4ce50f');
    };

    webSocket.onclose = function(event) {
      if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
        // initConnection()
      }
    };

    webSocket.onmessage = async function (event) {
      const _json = JSON.parse(event.data)

      if (_json.event == 'joined' || _json.event == 'left') {
        await store.commit('SET_ROOM_INFO', _json)
      } else if (_json && _json.payload && _json.payload.author != name.value) {
        // Only send notifications if player is not on screen
        if (idle.value)
          show()

        await store.commit('ADD_MESSAGE', _json.payload)
        scrollToBottom()
      }
    }
  }


  getKey(key.value)
  const clientID = uuidv4()
  initConnection()

  const {
    // isSupported,
    // notification,
    show,
    // close,
    // onClick,
    // onShow,
    // onError,
    // onClose,
  } = useWebNotification({
    title: `New message in ${roomName.value}`,
    dir: 'auto',
    lang: 'en',
    renotify: true,
    tag: 'test',
  })

  // Auto focus input field
  const messageInput = ref()
  const { focused } = useFocus(messageInput, { initialValue: true })


  onUnmounted(() => {
    webSocket.close();
  })
</script>

<template>
  <div id="roomInfo">
    In room ({{ room.room }})

    <ol>
      <li v-for="user in room.users">
        {{ user }}
      </li>
    </ol>
  </div>

  <h1>Welcome, {{ name }}</h1>

  <div id="messengersContainer">
    <template v-for="message in messages">
      <message-display :message="message" />
    </template>
  </div>

  <div id="inputRow">
    <textarea rows="3" type="text" placeholder="New Message" v-model="newMessage" @keyup.enter="submitMessage()" ref="messageInput" />

    <button type="button" name="button" @click="submitMessage">
      SEND
    </button>
  </div>
</template>

<style scoped>
  #roomInfo {
    position: fixed;
    top: 5px;
    left: 5px;

    border: 1px solid rgb(84 105 212 / 0.5);
    border-radius: 5px;

    padding: 10px 20px;

    text-align: left;
  }

  #messengersContainer, #inputRow {
    width: 1000px;
    max-width: 100%;
    margin: auto;
  }
  #messengersContainer {
    height: calc(100vh - 37px - 72px - 95px);
    overflow-y: auto;
    scroll-behavior: smooth;

    position: relative;
  }

  #inputRow {
    margin-top: 15px;
    height: 95px !important;
  }
  #inputRow textarea {
    font-size: 18px;
    width: calc(100% - 130px);
    margin-right: 10px;
    padding: 5px;
  }
  #inputRow button {
    width: 100px;
    height: 95px;

    position: relative;
    top: -41px;
  }
</style>
