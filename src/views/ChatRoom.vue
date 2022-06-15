<script setup>
  import MessageDisplay from '../components/chatRoom/MessageDisplay.vue'

  import { useStore } from "vuex";
  import { computed, ref, onUnmounted } from "vue";
  import { getKey, encryption, decryption } from '../services/util.translate.js'

  import { useWebNotification, useFocus, useWindowFocus, onStartTyping } from '@vueuse/core'


  const store = useStore();

  const room = ref(store.state.room);

  const name = ref(store.state.name);
  const roomName = ref(store.state.roomName);
  const key = ref(store.state.key);
  const messages = computed(() => store.state.messages);

  const newMessage = ref('')
  const isFocused = useWindowFocus()

  let isTyping = false
  const usersTyping = ref([])
  let timer;

  const imageUploadRef = ref()
  const imageToSend = ref()
  let imageToSend2 = null


  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  // Send text to all users through the server
  function sendText(message, type='message') {
    if (!message) {
      alert('Please type a message')
      return
    }

    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var msg = {
      type: type,
      author: encryption(name.value),
      text: encryption(message),
      id:   clientID,
      date: Date.now()
    };

    // Send the msg object as a JSON-formatted string.
    webSocket.send(JSON.stringify(msg));

    if (type == 'message' || type == 'image')
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

      clearTimeout(timer);
      sendText('IS_NOT_TYPING', 'action')
      isTyping = false
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

  function handleInput() {
    if (!isTyping)
      sendText('IS_TYPING', 'action')

    isTyping = true

    // once they stop typing for 2 seconds or send, we clear timeout
    clearTimeout(timer);
    timer = setTimeout(() => {
      sendText('IS_NOT_TYPING', 'action')
      isTyping = false
    }, 2000);
  }

  function handleChange($event) {
    const file = $event.target.files[0]

    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      imageToSend.value = e.target.result
    }
  }
  async function sendImage() {
    await sendText(imageToSend.value, 'image')
    imageToSend.value = null
    scrollToBottom()
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
        initConnection()
      }
    };

    webSocket.onmessage = async function (event) {
      const _json = JSON.parse(event.data)

      if (_json.event == 'joined' || _json.event == 'left') {
        await store.commit('SET_ROOM_INFO', _json)
      } else if (_json && _json.payload) {
        if (_json.payload.type == 'action') {
          const _text = decryption(_json.payload.text)

          if (_text == 'IS_TYPING') {
            usersTyping.value.push(_json.payload.author)
          } else if (_text == 'IS_NOT_TYPING') {
            const index = usersTyping.value.indexOf(_json.payload.author);
            if (index > -1)
              usersTyping.value.splice(index, 1);
          }
        } else if (_json.payload.author != name.value) {
          // Only send notifications if player is not on screen
          if (!isFocused.value)
            show()

          await store.commit('ADD_MESSAGE', _json.payload)
          scrollToBottom()
        }
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

  //  Will auto focus the input field when the user starts typing
  onStartTyping(() => {
    if (!messageInput.value.active)
      messageInput.value.focus()
  })

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
      <div v-if="message.event == 'joined'">
        <template v-if="message.user != name">
          {{ message.user}} joined
        </template>
      </div>
      <div v-else-if="message.event == 'left'">
        {{ message.user}} left
      </div>
      <template v-else>
        <message-display :message="message" />
      </template>
    </template>
  </div>

  <div id="toolbarRow">
    <input type="file" accept="image/*" class="icon-button" :value.sync="imageToSend2" @change="handleChange" ref="imageUploadRef" style="display: none;">
    <div class="icon-button" @click="imageUploadRef.click()">
      +
    </div>

    <template v-if="imageToSend" id="imagePreview">
      <img :src="imageToSend" />

      <button type="button" @click="sendImage">
        Send
      </button>
    </template>
  </div>

  <div id="inputRow">
    <textarea
      rows="3"
      type="text"
      placeholder="New Message"
      v-model="newMessage"
      @input="handleInput()"
      @keyup.enter="submitMessage()"
      ref="messageInput"
    />

    <button type="button" name="button" @click="submitMessage">
      SEND
    </button>
  </div>

  <div id="usersTypingRow">
    <template v-for="(user, index) in usersTyping" :key="user">
      {{ decryption(user) }} is typing... {{ index < usersTyping.length-1 ? ', ' : '' }}
    </template>
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

  #messengersContainer, #toolbarRow, #usersTypingRow, #inputRow {
    width: 1000px;
    max-width: 100%;
    margin: auto;
  }
  #messengersContainer {
    height: calc(100vh - 37px - 72px - 40px - 95px - 15px);
    overflow-y: auto;
    scroll-behavior: smooth;

    position: relative;
  }

  #usersTypingRow {
    text-align: left;
    padding-top: 5px;
    padding-left: 5px;
    height: 15px;
    font-size: 12px;
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


  .icon-button {
    width: 40px !important;
    height: 35px !important;

    text-align: center;
    font-size: 24px;
    padding-top: 5px;

    border: 1px solid grey;
    border-radius: 5px;

    margin: 0px !important;
  }

  #toolbarRow {
    position: relative;
    height: 40px !important;
  }

  #toolbarRow img {
    position: absolute;
    top: 1px;
    left: 50px;

    width: 70px !important;
    height: 40px !important;
  }
  #toolbarRow button {
    position: absolute;
    top: 1px;
    left: 130px;

    width: 70px !important;
    height: 40px !important;
  }
</style>
