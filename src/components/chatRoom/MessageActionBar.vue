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

  const emit = defineEmits(['setRoomEncryptStatus', 'sendText'])


  function handleChange($event) {
    const file = $event.target.files[0]

    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      imageToSend.value = e.target.result
    }
  }
  async function sendImage() {
    // await sendText(imageToSend.value, 'image')
    emit('sendText', imageToSend.value, 'image')
    imageToSend.value = null

  }

  function testUnlockKey() {
    if (unlockKey.value == key.value) {
      // setRoomEncryptStatus(false)
      emit('setRoomEncryptStatus', false)

      unlockKey.value = null
    }
  }

  document.onpaste = function(event){
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let index in items) {
      var item = items[index];
      if (item.kind === 'file') {
        var blob = item.getAsFile();
        var reader = new FileReader();
        reader.onload = function(event) {
          imageToSend.value = event.target.result
        }; // data url!
        reader.readAsDataURL(blob);
      }
    }
  }
</script>

<template>
  <div id="toolbarRow">
    <input type="file" accept="image/*" class="icon-button" :value.sync="imageToSend2" @change="handleChange" ref="imageUploadRef" style="display: none;">
    <v-btn id="imageUploadButton"
      class="ma-2"
      color="secondary"
      icon="mdi-image"
      @click="imageUploadRef.click()"
    />

    <template v-if="imageToSend" id="imagePreview">
      <img :src="imageToSend" />

      <v-btn id="sendImageButton" color="secondary" @click="sendImage">
        Send
      </v-btn>
    </template>

    <div v-if="containsEncryped" id="unlockKeyForm">
      <!-- <input type="text" id="unlockKeyInput" placeholder="Unlock Messages" v-model="unlockKey" @keyup.enter="testUnlockKey()"> -->
      <v-text-field id="unlockKeyInput"
        label="Unlock Messages"
        required
        v-model="unlockKey"
        @keyup.enter="testUnlockKey()"
      />

      <v-btn id="unlockKeyButton" color="secondary" @click="testUnlockKey">
        Submit
      </v-btn>
    </div>
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

  #imageUploadButton {
    width: 40px !important;
    height: 40px !important;
    margin: 0px !important;

    float: left;
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

  #unlockKeyForm .v-input {
    position: absolute;
    top: 1px;
    right: 130px;

    width: 175px;
  }
  #unlockKeyButton {
    position: absolute;
    top: 1px;
    right: 0px;

    width: 114px !important;
    height: 55px !important;
  }
</style>
