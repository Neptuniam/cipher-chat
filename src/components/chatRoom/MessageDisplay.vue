<script setup>
  import { useStore } from "vuex";
  import { ref } from "vue";
  import { decryption } from '../../services/util.translate.js'

  const store = useStore();

  const props = defineProps(['message'])

  const name = ref(store.state.name);

  const fromActiveUser = name.value == decryption(props.message.author)

  function uniqueColour(name, s=30, l=40) {
    let hash = 0
    for (var i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return 'hsl(' + hash % 360 + ', ' + s + '%, ' + l + '%)'
  }

  function readableDateTime(time) {
    const _date = new Date(time)
    let _hours = _date.getHours()
    let zone = 'am'

    if (_hours > 12) {
      _hours -= 12
      zone = 'pm'
    }

    return `${_hours}:${_date.getMinutes()}${zone}`
  }
</script>

<template>
  <div id="messageContainer" :class="{ 'received': !fromActiveUser, 'sent': fromActiveUser }">
    <div id="message">
      {{ decryption(props.message.text) }}
    </div>

    <div id="author" :style="`color: ${uniqueColour(decryption(props.message.author))}`">
      {{ decryption(props.message.author) }}
    </div>

    <div id="dateTime">
      {{ readableDateTime(props.message.date) }}
    </div>
  </div>
</template>

<style scoped>
  #messageContainer {
    max-width: 500px;
    /* width: calc(100% - 10px); */
    /* height: 300px; */

    border: 1px solid gray;
    border-radius: 5px;

    margin: 10px;
    padding: 5px;

    text-align: left;

    position: relative;
  }

  #messageContainer.received {
    margin: 10px auto 10px 0px;
    border-color: #00A400 !important;
  }
  #messageContainer.sent {
    margin: 10px 0px 10px auto;
    border-color: #1877F2 !important;
  }

  #message {
    font-size: 22px;
    font-weight: 500;
  }

  #author {
    font-size: 14px;
    margin-top: 20px
  }

  #dateTime {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
</style>
