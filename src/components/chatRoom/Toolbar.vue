<script setup>
  import { useStore } from "vuex";
  import { ref } from "vue";
  import { decryption } from '../../services/util.translate.js'

  const store = useStore();

  const name = ref(store.state.name);
  const roomName = ref(store.state.roomName);
  const room = ref(store.state.room);

  function toggleDarkMode() {
    store.dispatch('toggleTheme')
  }

  function leaveRoom() {
    store.commit('SAVE_PROFILE', {
      name: name.value,
      roomName: roomName.value,
      key: null
    })
  }
</script>

<template>
  <v-navigation-drawer :expand-on-hover="true" :rail="true">
   <v-list>
     <v-list-item
       :title="''+room.room"
     ></v-list-item>

     <div v-for="(user, index) in room.users" style="text-align: left; padding-left: 5px;">
       {{ index+1 }}. {{ user }}
     </div>
   </v-list>

   <v-divider></v-divider>

   <v-list nav>
     <v-list-item prepend-icon="mdi-close" title="Clear Chat" class="clickable" style="text-align: left" @click="$emit('clearChat')" />
     <v-list-item prepend-icon="mdi-lock-plus" title="Encrypt Chat" class="clickable" style="text-align: left" @click="$emit('setRoomEncryptStatus', true)" />

     <br>
     <v-list-item prepend-icon="mdi-theme-light-dark" title="Toggle Dark Mode" class="clickable" style="text-align: left" @click="toggleDarkMode" />
   </v-list>


     <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="primary" @click="leaveRoom">
          Exit
        </v-btn>
      </div>
    </template>
 </v-navigation-drawer>
</template>

<style>
  nav {
    transform: none !important;
    height: 100%;
  }
</style>
