<template>
  <v-app>
    <Menu v-on:menu_item="menu_item($event)" v-on:connected="connected($event)"/>
    <Accueil  v-if="item === `Accueil`"/>
    <Quizz    v-if="item === `Quizz`"/>
    <Admin v-if="connect && item === `Admin`"/>
    <Bottom />
  </v-app>
</template>

<script>
import Menu from './component/Monmenu.vue'
import Accueil from './component/Accueil.vue'
import Quizz from './component/Quizz.vue'
import Bottom from './component/Bottom.vue'
import Admin from './component/Admin.vue'
export default {
  name: 'App',
  components: {
    Menu,
    Accueil,
    Quizz,
    Bottom,
    Admin
  },
  data: () => ({
    item: `Accueil`,
    connect: false
  }),
  methods: {
    menu_item: function (e) {
      this.item = e
    },
    connected: function (e) {
      this.connect = e
    }
  },
  created () {
  }
}
</script>

<style scoped>
</style>
