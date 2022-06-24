<script setup>
import { useStore } from "vuex"
import { ref } from "vue"

const store = useStore()

const name = ref(store.state.name)
const roomName = ref(store.state.roomName)
const room = ref(store.state.room)

const emit = defineEmits(["setRoomEncryptStatus"])

const actions = [
  {
    title: "Clear Chat",
    icon: "mdi-close",
    action: () => store.commit("CLEAR_CHAT"),
  },
  {
    title: "Encrypt Chat",
    icon: "mdi-lock-plus",
    action: () => emit("setRoomEncryptStatus", true),
  },
  {
    title: "Toggle Theme",
    icon: "mdi-theme-light-dark",
    action: toggleDarkMode,
  },
]

function toggleDarkMode() {
  store.dispatch("toggleTheme")
}

function leaveRoom() {
  store.commit("SAVE_PROFILE", {
    name: name.value,
    roomName: roomName.value,
    key: null,
  })
}
</script>

<template>
  <component
    :is="$vuetify.display.mdAndUp ? 'v-navigation-drawer' : 'v-app-bar'"
    :expand-on-hover="true"
    :rail="true"
  >
    <v-list>
      <v-list-item :title="'' + room.room"></v-list-item>

      <template v-if="$vuetify.display.mdAndUp">
        <div
          v-for="(user, index) in room.users"
          id="userName"
          :key="index"
          style="text-align: left; padding-left: 5px"
        >
          {{ index + 1 }}. {{ user }}
        </div>
      </template>
    </v-list>

    <v-divider v-if="$vuetify.display.mdAndUp"></v-divider>

    <v-list v-if="$vuetify.display.mdAndUp" nav>
      <template v-for="(action, index) in actions" :key="index">
        <v-list-item
          :prepend-icon="action.icon"
          :title="action.title"
          class="clickable"
          @click="action.action"
        />
      </template>
      <!-- <v-list-item prepend-icon="mdi-close" title="Clear Chat" class="clickable" @click="$emit('clearChat')" />
     <v-list-item prepend-icon="mdi-lock-plus" title="Encrypt Chat" class="clickable" @click="$emit('setRoomEncryptStatus', true)" />

     <br>
     <v-list-item prepend-icon="mdi-theme-light-dark" title="Toggle Dark Mode" class="clickable" @click="toggleDarkMode" /> -->
    </v-list>
    <div v-else>
      <template v-for="(action, index) in actions" :key="index">
        <v-btn color="secondary" :icon="action.icon" @click="action.action" />
      </template>
      <!-- <v-btn
       color="secondary"
       icon="mdi-close"
       @click="$emit('clearChat')"
     />

     <v-btn
       color="secondary"
       icon="mdi-lock-plus"
       @click="$emit('setRoomEncryptStatus', true)"
     />

     <v-btn
       color="secondary"
       icon="mdi-theme-light-dark"
       @click="toggleDarkMode"
     /> -->
    </div>

    <template #append>
      <div class="pa-2">
        <v-btn block color="primary" @click="leaveRoom"> Exit </v-btn>
      </div>
    </template>
  </component>
</template>

<style>
nav {
  transform: none !important;
  height: 100%;
}

.v-list-item--nav .v-list-item-title {
  font-size: 18px !important;
  line-height: 1.3rem !important;
  text-align: left;
}

@media only screen and (max-width: 940px) {
  .v-list-item--nav .v-list-item-title {
    display: none !important;
  }
}
</style>
<style scoped>
#userName {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
