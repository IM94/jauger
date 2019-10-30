<template>
  <div>
    <v-toolbar id="toolbar" @mouseover="on.toolbar = true" @mouseleave="on.toolbar = false">
      <img :src="require(`@/asset/icon.png`)">
      <v-spacer></v-spacer>
      <p id="title" class="mb-0">SE JAUGER</p>
      <v-spacer></v-spacer>
      <v-btn tile color="#199461" id="connexion" @click="status"> {{ connect.text }}</v-btn>
      <template v-if="on.toolbar" #extension>
        <v-toolbar-items>
          <v-btn-toggle group>
            <v-btn @click="toolbar_items('Accueil')">Accueil</v-btn>
            <v-btn @click="toolbar_items('Quizz')">Listes des quizz</v-btn>
            <v-btn @click="toolbar_items('Admin')" v-if="connect.connecter">Page Administrateur</v-btn>
          </v-btn-toggle>
        </v-toolbar-items>
      </template>
    </v-toolbar>
    <v-form :id="field.id" v-if="field.see && !connect.connecter">
      <v-text-field id="login"    v-model="field.login" label="ID"      filled required></v-text-field>
      <v-text-field id="password" v-model="field.password" label="MDP"  filled required :type="!field.checkbox?`password`:``"></v-text-field>
      <v-checkbox   id="checkbox" v-model="field.checkbox" label="Voir le mot de passe"></v-checkbox>
      <v-btn        id="boutton"  width="100%" tile @click="connexion">Connexion</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    on: {
      toolbar: false
    },
    field: {
      id: `form`,
      see: false,
      password: `cherel`,
      login: `louis`,
      checkbox: false
    },
    connect: {
      text: `connexion`,
      connecter: false
    }
  }),
  methods: {
    connexion: function () {
      this.axios.post(`/api/connect`, { login: this.field.login, password: this.field.password })
        .then(jsondata => {
          if (jsondata.data.connect) {
            this.field.id = `form`
            this.connect.connecter = true
            this.connect.text = `deconnexion`
          } else {
            this.field.id = `formFalse`
          }
          this.$emit('connected', this.connect.connecter)
        }).catch(error => {
          console.log(error)
        })
    },
    deconnexion: function () {
      this.connect.connecter = false
      this.connect.text = `connexion`
    },
    status: function () {
      if (this.connect.connecter) {
        this.deconnexion()
      } else {
        this.field.see = !this.field.see
      }
    },
    toolbar_items: function (variable) {
      this.$emit('menu_item', variable)
    }
  }
}
</script>

<style scoped>
#toolbar #title{
  font-size: 32px;
  user-select: none;
  color: #199461;
  font-weight: bold;
}
#toolbar #connexion{
  color: #ffffff;
}
#form #checkbox{
  float:left;
}
#form{
  background-color:rgba(0,125,125,0.15);
}
#form:hover{
  background-color:rgba(60,125,125,1);
}
#formFalse{
  background-color:rgba(255,0,0,0.15);
}
#formFalse:hover{
  background-color:rgba(255,0,0,1);
}
#form, #formFalse{
  width:300px;
  position: absolute;
  left: 100%;
  transform: translate(calc(-100% - 1px));
  z-index: 1;
}
#form:hover #boutton{
  background-color: rgba(255,255,255,1);
}
#form #boutton{
  background-color: rgba(255,255,255,0.1);
}
</style>
