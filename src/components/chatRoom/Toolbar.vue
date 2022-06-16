<script setup>
  import { useStore } from "vuex";
  import { ref, computed } from "vue";
  import { useStorage, useWebNotification, useFocus, useWindowFocus, useIdle, onStartTyping } from '@vueuse/core'

  const store = useStore();

  const roomName = ref(store.state.roomName);
  const key = ref(store.state.key);

  const messagesMap = useStorage('messagesMap', {})
  const messages = ref(messagesMap.value[roomName.value] || []);

  const imageUploadRef = ref()
  const imageToSend = ref()
  let imageToSend2 = null

  const unlockKey = ref('')
  const containsEncryped = computed(() => !!messages.value.find(_message => _message.isEncrypted))

  const emit = defineEmits(['setRoomEncryptStatus'])


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

  function testUnlockKey() {
    if (unlockKey.value == key.value) {
      // setRoomEncryptStatus(false)
      emit('setRoomEncryptStatus', false)

      unlockKey.value = null
    }
  }
</script>

<template>
  <div id="toolbarRow">
    <input type="file" accept="image/*" class="icon-button" :value.sync="imageToSend2" @change="handleChange" ref="imageUploadRef" style="display: none;">
    <div class="icon-button" @click="imageUploadRef.click()">
      +
    </div>

    <template v-if="imageToSend" id="imagePreview">
      <img :src="imageToSend" />

      <button type="button" id="sendImageButton" @click="sendImage">
        Send
      </button>
    </template>

    <template v-if="containsEncryped">
      <input type="text" id="unlockKeyInput" placeholder="Unlock Messages" v-model="unlockKey" @keyup.enter="testUnlockKey()">

      <button type="button" id="unlockKeyButton" @click="testUnlockKey">
        Submit
      </button>
    </template>

    <button type="button" id="clearButton" @click="$emit('clearChat')">
      Clear
    </button>
  </div>
</template>

<style scoped>
  .icon-button {
    width: 40px !important;
    height: 35px !important;

    text-align: center;
    font-size: 24px;
    padding-top: 5px;

    border: 1px solid grey;
    border-radius: 5px;

    margin: 0px !important;
    cursor: pointer;
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
  #toolbarRow #sendImageButton {
    position: absolute;
    top: 1px;
    left: 130px;

    width: 70px !important;
    height: 40px !important;
  }

  #unlockKeyInput {
    position: absolute;
    top: 1px;
    right: 230px;

    width: 150px;
  }
  #unlockKeyButton {
    position: absolute;
    top: 1px;
    right: 115px;

    width: 100px !important;
    height: 40px !important;
  }

  #clearButton {
    position: absolute;
    top: 1px;
    right: 5px;

    width: 100px !important;
    height: 40px !important;
  }
</style>
