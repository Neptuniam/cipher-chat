<script setup>
  import MessageDisplay from '../components/chatRoom/MessageDisplay.vue'
  import MessageActionBar from '../components/chatRoom/MessageActionBar.vue'
  import Toolbar from '../components/chatRoom/Toolbar.vue'

  import { useStore } from "vuex";
  import { computed, ref, watch, onUnmounted } from "vue";
  import { getKey, encryption, decryption } from '../services/util.translate.js'

  import { useStorage, useWebNotification, useFocus, useWindowFocus, useIdle, onStartTyping } from '@vueuse/core'


  const store = useStore();

  const room = ref(store.state.room);

  const name = ref(store.state.name);
  const roomName = ref(store.state.roomName);
  const key = ref(store.state.key);

  const messagesMap = useStorage('messagesMap', {})
  const messages = computed(() => store.getters.getMessages);

  const newMessage = ref('')
  const isFocused = useWindowFocus()

  let isTyping = false
  const usersTyping = ref([])
  let timer;

  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function setRoomEncryptStatus(status) {
    messages.value.forEach(_message => {
      _message.isEncrypted = status
    });

    messagesMap.value[roomName.value] = messages
  }

  function pushMessage(message) {
    store.commit('PUSH_MESSAGE', {
      ...message,
      'isEncrypted': idle.value
    })
  }

  // Send text to all users through the server
  async function sendText(message, type='message') {
    if (!message) {
      alert('Please type a message')
      return
    }

    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var msg = {
      type: type,
      room: encryption(roomName.value),
      author: encryption(name.value),
      text: encryption(message),
      id:   clientID,
      date: Date.now()
    };

    // Send the msg object as a JSON-formatted string.
    await webSocket.send(JSON.stringify(msg));

    if (type == 'message' || type == 'image')
      pushMessage(msg)

    scrollToBottom()
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

  function attemptNotification() {
    // Only send notifications if player is not on screen
    if (!isFocused.value)
      show()
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
        pushMessage(_json)
        attemptNotification()
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
          attemptNotification()

          await pushMessage(_json.payload)
          scrollToBottom()
        }
      }
    }
  }


  getKey(key.value)
  const clientID = uuidv4()
  initConnection()
  setRoomEncryptStatus(false)
  setTimeout(() => scrollToBottom(), 1000)

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

  const { idle, lastActive } = useIdle(1000 * 60 * 30) // 30 min

  watch(idle, () => {
    // We auto encrypt all messages once the user goes idle
    // they can re-enter the key to see the messages again
    if (idle.value)
      setRoomEncryptStatus(true)
  })

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
  <v-layout>
    <toolbar @setRoomEncryptStatus="setRoomEncryptStatus" />

    <v-main theme="dark">
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


      <message-action-bar @setRoomEncryptStatus="setRoomEncryptStatus" @sendText="sendText" />

      <v-row id="inputRow">
        <v-textarea
          label="New Message"
          outlined
          rows="2"
          row-height="15"
          v-model="newMessage"
          @input="handleInput()"
          @keyup.enter="submitMessage()"
          ref="messageInput"
        />

        <v-btn color="primary" @click="submitMessage">
          SEND
        </v-btn>
      </v-row>

      <div id="usersTypingRow">
        <template v-for="(user, index) in usersTyping" :key="user">
          {{ decryption(user) }} is typing... {{ index < usersTyping.length-1 ? ', ' : '' }}
        </template>
      </div>
    </v-main>
  </v-layout>
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
    width: 1020px;
    max-width: 100%;
    margin: auto;
    padding: 0px 10px;
  }
  #messengersContainer {
    height: calc(100vh - 37px - 40px - 84px - 10px);
    overflow-y: auto;
    scroll-behavior: smooth;

    position: relative;
  }
  @media only screen and (max-width: 940px) {
    #messengersContainer {
      height: calc(100vh - 64px - 37px - 40px - 84px - 10px);
    }
  }

  #usersTypingRow {
    position: relative;
    top: -23px;
    left: 10px;

    z-index: 0;

    text-align: left;
    padding-top: 5px;
    padding-left: 5px;
    height: 30px;
    font-size: 12px;
  }

  #inputRow {
    margin-top: 15px;
    height: 114px !important;
  }
  #inputRow .v-input {
    font-size: 18px;
    /* width: calc(100% - 130px); */
    margin-right: 10px;
    padding: 5px;
  }
  #inputRow button {
    width: 84px;
    height: 84px;

    position: relative;
    top: 5px;
    /* top: -41px; */
  }
</style>
