<template>
  <div>
    <v-list-item v-if="!click">
      <v-list-item-content>
        <v-list-item-title  v-for="element in list" :key="element.id">
          <v-btn tile id="btn" @click="clicked(element.id,element.text)">{{ element.text }} </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <listQuizz v-else :value="id" :page="text"/>
  </div>
</template>

<script>
import listQuizz from './MonQuizz.vue'
export default {
  data: () => ({
    list: [],
    click: false,
    id: 0,
    text: ``
  }),
  components: {
    listQuizz
  },
  methods: {
    clicked: function (id, text) {
      this.id = id
      this.click = true
      this.text = text
    }
  },
  created () {
    this.axios.get('http://localhost:4000/api/quizz/list')
      .then(jsondata => {
        this.list = jsondata.data.quizz
      }).catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#btn{
  width:100%
}
</style>
