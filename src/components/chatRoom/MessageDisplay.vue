<script setup>
  import { useStore } from "vuex";
  import { ref } from "vue";
  import { decryption } from '../../services/util.translate.js'

  const store = useStore();

  const props = defineProps(['message'])

  const name = ref(store.state.name);

  const fromActiveUser = name.value == props.message.author
</script>

<template>
  <div id="messageContainer" :class="{ 'received': !fromActiveUser, 'sent': fromActiveUser }">
    <div id="message">
      {{ decryption(props.message.text) }}
    </div>

    <div id="author">
      {{ props.message.author }}
    </div>
  </div>
</template>

<style scoped>
  #messageContainer {
    max-width: 500px;
    width: calc(100% - 10px);
    height: 300px;

    border: 1px solid gray;
    border-radius: 5px;

    margin: 10px;
    padding: 5px;

    text-align: left;
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
</style>
