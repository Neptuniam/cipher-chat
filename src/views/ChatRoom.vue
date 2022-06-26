<script setup>
import MessageDisplay from "../components/chatRoom/MessageDisplay.vue"
import MessageActionBar from "../components/chatRoom/MessageActionBar.vue"
import Toolbar from "../components/chatRoom/Toolbar.vue"

import { useStore } from "vuex"
import { computed, ref, watch } from "vue"
import { getKey, encryption, decryption } from "../services/util.translate.js"

import {
  useStorage,
  useWebSocket,
  useWebNotification,
  useFocus,
  useWindowFocus,
  useIdle,
  onStartTyping,
} from "@vueuse/core"

const store = useStore()

const name = ref(store.state.name)
const roomName = ref(store.state.roomName)
const key = ref(store.state.key)
const room = ref(store.state.room)

const messagesMap = useStorage("messagesMap", {})
const messages = computed(() => store.getters.getMessages)

const newMessage = ref("")
const isFocused = useWindowFocus()

let isTyping = false
const usersTyping = ref([])
const activeUsers = ref([])
let timer
const actionBarRef = ref()


function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

function setRoomEncryptStatus(status) {
  messages.value.forEach((_message) => {
    _message.isEncrypted = status
  })

  messagesMap.value[roomName.value] = messages
}

function pushMessage(message) {
  return store.commit("PUSH_MESSAGE", {
    ...message,
    isEncrypted: idle.value,
  })
}

// Send text to all users through the server
async function sendText(message, type = "message") {
  if (!message) {
    return
  }

  // Construct a msg object containing the data the server needs to process the message from the chat client.
  var msg = {
    type: type,
    room: encryption(roomName.value),
    author: encryption(name.value),
    text: encryption(message),
    id: clientID,
    date: Date.now(),
  }

  // Send the msg object as a JSON-formatted string.
  await send(JSON.stringify(msg))

  if (type == "message" || type == "image") pushMessage(msg)

  scrollToBottom()
}

function slashCommand() {
  const original = newMessage.value
  const multi = original.split(" ")
  const cmd = multi.shift()

  switch (cmd) {
    case "/shrug":
      // eslint-disable-next-line no-useless-escape
      return "¯\_(ツ)_/¯"
    case "/scroll":
      return `<marquee>${multi.join(" ")}</marquee>`
    case "/room":
      return `
    ${roomName.value}\n${room.value.users.map(_user => {
      let status = "(Not Active)"
      if (name.value == _user) {
        status = "(You)"
      } else if (activeUsers.value.find(_activeUser => decryption(_activeUser) == _user)) {
        status = "(Active)"
      }

      return `* ${_user} ${status}`
    }).join('\n')}
      `
    case "/encrypt":
      setRoomEncryptStatus(true)
      return
    case "/clear":
      store.commit("CLEAR_CHAT")
      return
    case "/help":
    case "/h":
      return `#### Slash Command Help
  * \`/shrug\`: just cause
  * \`/scroll <msg>\`: add absurd scrolling effects
  * \`/room\`: room info
  * \`/encrypt\`: encrypt history
  * \`/clear\`: clear chat history
  * \`/help\`: help text
      `
  }

  return original
}

async function submitMessage() {
  // Send images with the message
  if (actionBarRef && actionBarRef.value && actionBarRef.value.sendImage)
    actionBarRef.value.sendImage()

  let msg = newMessage.value

  if (msg[0] == "/") {
    msg = slashCommand()
  }

  await sendText(msg)
  newMessage.value = null
  scrollToBottom()

  clearTimeout(timer)
  sendText("IS_NOT_TYPING", "action")
  isTyping = false
}

function attemptNotification() {
  // Only send notifications if player is not on screen
  if (!isFocused.value) showNewMessage()
}

function scrollToBottom() {
  let messengersContainer = document.getElementById("messengersContainer")

  if (messengersContainer)
    messengersContainer.scroll({
      top: messengersContainer.scrollHeight,
      behavior: "smooth",
    })
}

function handleInput() {
  if (!isTyping) sendText("IS_TYPING", "action")

  isTyping = true

  // once they stop typing for 2 seconds or send, we clear timeout
  clearTimeout(timer)
  timer = setTimeout(() => {
    sendText("IS_NOT_TYPING", "action")
    isTyping = false
  }, 2000)
}

getKey(key.value)
const clientID = uuidv4()

// Connect to the websocket
const url = `wss://apps.carterbourette.ca/chat/rooms/${roomName.value}/users/${name.value}`
const { status, data, send } = useWebSocket(url, {
  autoReconnect: {
    delay: 1000,
    onFailed() {
      alert("Failed to connect WebSocket after 3 retries")
    },
  },
})

watch(status, (status) => {
  console.log("Websocket status:", status)
})

// Authenticate with the backend
send("5209ac21-2004-4f17-bdf4-b2e66d4ce50f")

watch(data, async (event) => {
  const _json = JSON.parse(event)

  if (_json.event == "joined" || _json.event == "left") {
    store.commit("SET_ROOM_INFO", _json)
    await pushMessage(_json)
    attemptNotification()
    scrollToBottom()
  } else if (_json && _json.payload) {
    if (_json.payload.type == "action") {
      const _text = decryption(_json.payload.text)
      const author = _json.payload.author

      switch (_text) {
        case "IS_TYPING":
          usersTyping.value.push(author)

          break
        case "IS_NOT_TYPING":
          var index = usersTyping.value.indexOf(author)
          if (index > -1) usersTyping.value.splice(index, 1)

          break

        case "IS_FOCUSED":
          // Should only exist in list once
          var index = activeUsers.value.indexOf(author)
          if (index == -1) activeUsers.value.push(author)
          
          break
        case "IS_NOT_FOCUSED":
          var index = activeUsers.value.indexOf(author)
          if (index > -1) activeUsers.value.splice(index, 1)

          break
      }
    } else if (_json.payload.author != name.value) {
      const _text = decryption(_json.payload.text)

      attemptNotification()

      await pushMessage(_json.payload)
      scrollToBottom()

      if (_text.toLowerCase().includes(`@${name.value.toLowerCase()}`)) {
        showTagged()
        alert(`${decryption(_json.payload.author)} tagged you in a message`)
      }
    }
  }
})

setRoomEncryptStatus(false)
setTimeout(() => scrollToBottom(), 1000)

const { show: showNewMessage } = useWebNotification({
  title: `New message in ${roomName.value}`,
  dir: "auto",
  lang: "en",
  renotify: true,
  tag: "test",
})
const { show: showTagged} = useWebNotification({
  title: `Tagged in a message in ${roomName.value}`,
  dir: "auto",
  lang: "en",
  renotify: true,
  tag: "test",
})

// Auto focus input field
const messageInput = ref()
useFocus(messageInput, { initialValue: true })

const { idle } = useIdle(1000 * 60 * 30) // 30 min

watch(idle, () => {
  // We auto encrypt all messages once the user goes idle
  // they can re-enter the key to see the messages again
  if (idle.value) setRoomEncryptStatus(true)
})

watch(
  isFocused,
  (isFocused) => {
    sendText(isFocused === true ? "IS_FOCUSED" : "IS_NOT_FOCUSED", "action")
  },
  { immediate: true }
)

//  Will auto focus the input field when the user starts typing
onStartTyping(() => {
  if (!messageInput.value.active) messageInput.value.focus()
})
</script>

<template>
  <v-layout>
    <toolbar @set-room-encrypt-status="setRoomEncryptStatus" />

    <v-main theme="dark">
      <div id="messengersContainer">
        <!-- hacks but only way it worked on my android? Will need to test in prod -->
        <div v-if="$vuetify.display.smAndDown" style="height: 55px;"></div>
        <template v-for="message in messages" :key="message.user">
          <div v-if="message.event == 'joined'">
            <template v-if="message.user != name">
              {{ message.user }} joined
            </template>
          </div>
          <div v-else-if="message.event == 'left'">
            {{ message.user }} left
          </div>
          <template v-else>
            <message-display :message="message" />
          </template>
        </template>
      </div>

      <message-action-bar ref="actionBarRef"
        @set-room-encrypt-status="setRoomEncryptStatus"
        @send-text="sendText"
      />

      <v-row id="inputRow">
        <v-textarea
          ref="messageInput"
          v-model="newMessage"
          label="New Message"
          outlined
          rows="2"
          row-height="15"
          @input="handleInput()"
          @keydown.enter.exact.prevent="submitMessage()"
          @keydown.enter.shift.exact.prevent="newMessage += '\n'"
        />

        <v-btn color="primary" @click="submitMessage"> SEND </v-btn>
      </v-row>
      <div id="usersTypingRow">
        <template v-if="usersTyping == null || !usersTyping.length">
          <template v-for="(user, index) in activeUsers" :key="user">
            <v-icon> mdi-eye-outline </v-icon>
            {{ decryption(user) }} is active
            {{ index < activeUsers.length - 1 ? ", " : "" }}
          </template>
        </template>
        <template v-else>
          <template v-for="(user, index) in usersTyping" :key="user">
            {{ decryption(user) }} is typing...
            {{ index < usersTyping.length - 1 ? ", " : "" }}
          </template>
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

#messengersContainer,
#toolbarRow,
#usersTypingRow,
#inputRow {
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
