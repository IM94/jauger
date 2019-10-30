<template>
  <div>
    <p id="title">{{ page }}</p>
    <div v-if="!clicked">
      <div v-for="element in table" :key="element.id">
        <v-select v-model="select[element.id]" :items="element.reponse" filled item-text="text" :label="element.question" dense></v-select>
      </div>
      <v-btn :disabled="select.length !== table.length" width="100%" tile @click="click()">Confirmer</v-btn>
    </div>
    <p v-else style="text-align:center;font-size:20px;">Ton score est de <span :id="score.color">{{ score.value }} points</span></p>
  </div>
  </template>

<script>
export default {
  data: () => ({
    table: [],
    select: [],
    clicked: false,
    score: {
      value: 0,
      color: `green`
    }
  }),
  methods: {
    getApi: function ({ theme }) {
      let i = 0
      theme.forEach(element => {
        this.table.push([])
        this.table[i].question = element.question
        this.table[i].reponse = []
        this.table[i].id = i
        element.reponse.forEach(element => {
          const text = element.text
          const point = element.point
          const value = {
            text: text,
            point: point
          }
          this.table[i].reponse.push(value)
        })
        i++
      })
    },
    click: function () {
      this.clicked = true
      this.score.value = 0
      let i = 0
      let maxValue = 0
      this.table.forEach(element => {
        let max = 0
        this.score.value += element.reponse.find(element => element.text === this.select[i]).point
        element.reponse.forEach(element => {
          max = max < element.point ? element.point : max
        })
        maxValue += max
        i++
      })
      if (this.score.value <= maxValue * 2.0 / 3.0) {
        this.score.color = `orange`
      }
      if (this.score.value <= maxValue / 3.0) {
        this.score.color = `red`
      }
      this.dataServerEmission()
    },
    dataServerEmission: function () {
      this.axios.post('http://localhost:4000/api/quizz/reponse', { id: this.value, reponse: this.select, score: this.score })
        .catch(error => {
          console.log(error)
        })
    }
  },
  props: ['value', 'page'],
  created () {
    this.axios.post('http://localhost:4000/api/quizz/question', { id: this.value })
      .then(jsondata => {
        this.getApi(jsondata.data.quizz)
      }).catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#confirm{
  width: 100%;
}
#title{
  text-align: center;
  padding: 10px;
  padding-bottom: 0;
  font-size: 32px;
}
#green{
  color:green;
}
#red{
  color:red;
}
#orange{
  color:orange;
}
</style>
