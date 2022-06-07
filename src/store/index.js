import { createStore } from "vuex";

const store = createStore({
  state: {
    name: null,
    key: null,

    messages: [
      // {"type": "message", "author": "Liam", "text": "D~ff^", "id": "40d3ed63-c534-4d4d-9b55-987e7d1926ca", "date": 1654573008604},
      // {"type": "message", "author": "Carter", "text": "|%", "id": "bfecc76e-7f12-4e9e-ba12-a78cd766d354", "date": 1654573068494},
      // {"type": "message", "author": "Liam", "text": "D~ff^", "id": "40d3ed63-c534-4d4d-9b55-987e7d1926ca", "date": 1654573008604},
      // {"type": "message", "author": "Carter", "text": "|%", "id": "bfecc76e-7f12-4e9e-ba12-a78cd766d354", "date": 1654573068494},
      // {
      //   author: "Carter",
      //   date: 1654643540585,
      //   id: "98ddfb28-d45d-49d3-9d0b-b48ed8cf3661",
      //   text: "o|%O %O U O$&~! f^b} n~OOU}~ %n a$O@ @!#%b} @^ @~O@ =|U@ |U&&~bO =%@| @~\"@ =!U&&%b} UbP O@${{ O^ @|%O =%ff v~ z^&# &UO@~P ^bz~ ^! @=%z~, o|%O %O U O$&~! f^b} n~OOU}~ %n a$O@ @!#%b} @^ @~O@ =|U@ |U&&~bO =%@| @~\"@ =!U&&%b} UbP O@${{ O^ @|%O =%ff v~ z^&# &UO@~P ^bz~ ^! @=%z~, o|%O %O U O$&~! f^b} n~OOU}~ %n a$O@ @!#%b} @^ @~O@ =|U@ |U&&~bO =%@| @~\"@ =!U&&%b} UbP O@${{ O^ @|%O =%ff v~ z^&# &UO@~P ^bz~ ^! @=%z~",
      //   type: "message"
      // },
      // {
      //   author: "Carter",
      //   date: 1654643540585,
      //   id: "98ddfb28-d45d-49d3-9d0b-b48ed8cf3661",
      //   text: "o|%O %O U O$&~! f^b} n~OOU}~ %n a$O@ @!#%b} @^ @~O@ =|U@ |U&&~bO =%@| @~\"@ =!U&&%b} UbP O@${{ O^ @|%O =%ff v~ z^&# &UO@~P ^bz~ ^! @=%z~, o|%O %O U O$&~! f^b} n~OOU}~ %n a$O@ @!#%b} @^ @~O@ =|U@ |U&&~bO =%@| @~\"@ =!U&&%b} UbP O@${{ O^ @|%O =%ff v~ z^&# &UO@~P ^bz~ ^! @=%z~, o|%O %O U O$&~! f^b} n~OOU}~ %n a$O@ @!#%b} @^ @~O@ =|U@ |U&&~bO =%@| @~\"@ =!U&&%b} UbP O@${{ O^ @|%O =%ff v~ z^&# &UO@~P ^bz~ ^! @=%z~",
      //   type: "message"
      // }
    ]
  },
  getters:{
    totalNotes(state) {
      return state.notes.length;
    }
  },
  mutations:{
    SAVE_PROFILE(state, profile) {
      const { name, key } = profile

      state.name = name
      state.key = key
    },

    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    }
  },
  actions:{
    saveNote({ commit }, profile) {
      commit('SAVE_NOTE',title);
    }
  }
});

export default store;
