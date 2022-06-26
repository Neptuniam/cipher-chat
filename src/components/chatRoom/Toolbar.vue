<script setup>
import { useStore } from "vuex"
import { ref } from "vue"

const store = useStore()

const name = ref(store.state.name)
const roomName = ref(store.state.roomName)
const room = ref(store.state.room)

const showNavBar = ref(false)

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
  <v-app-bar v-if="$vuetify.display.smAndDown">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        color="primary"
        @click="showNavBar = !showNavBar"
      />
    </template>

    <v-app-bar-title>
      {{ room.room }}
    </v-app-bar-title>

    <template #append>
      <v-btn
        class="ma-2"
        color="primary"
        icon="mdi-exit-to-app"
        @click="leaveRoom"
      />
    </template>
  </v-app-bar>

  <v-navigation-drawer id="navDrawer" :class="{ 'showing': showNavBar }"
     @click="showNavBar = false"
    :expand-on-hover="true"
    :rail="$vuetify.display.mdAndUp"
  >
    <v-list>
      <v-list-item :title="'' + room.room"></v-list-item>

      <div
        v-for="(user, index) in room.users"
        id="userName"
        :key="index"
        style="text-align: left; padding-left: 5px"
      >
        {{ index + 1 }}. {{ user }}
      </div>
    </v-list>

    <v-divider></v-divider>

    <v-list nav>
      <template v-for="(action, index) in actions" :key="index">
        <v-list-item
          :prepend-icon="action.icon"
          :title="action.title"
          class="clickable"
          @click="action.action"
        />
      </template>
    </v-list>

    <template v-if="$vuetify.display.mdAndUp" #append>
      <div class="pa-2">
        <v-btn block color="primary" @click="leaveRoom"> Exit </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
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
    /* display: none !important; */
  }

  #navDrawer {
    position: fixed !important;
    /* top: 0px !important; */
    left: -100vw !important;

    /* margin-top: 0px !important;
    height: 100vh !important;

    z-index: 0 !important; */

    -webkit-transition: all .5s ease-in-out;
  }
  #navDrawer.showing {
    left: 0px !important
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
