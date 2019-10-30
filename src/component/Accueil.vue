<template>
  <div>
    <img :src="require(`@/asset/bandeau.jpg`)" width="100%" id="img">
    <p id="description"><b><em>Description du projet:</em></b> <br>{{ description }}</p>
    <div id="statistique">
      <p style="text-align:center;height:content;"><b>statistique</b></p>
      <div v-for="element in stat" :key="element.id">
        <v-list>
          <v-list-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="element.theme" style="font-size:20px;"></v-list-item-title>
              </v-list-item-content>
            </template>
            <div style="background-color:#e2e2e2">
              <v-list-item v-for="element2 in text" :key="element2.id">
                <v-list-item-content>
                  <v-list-item-title :style="`color:`+ getColor(element.id, element2.id)" v-text="element2.text + ': ' + getElement(element.id, element2.id)"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
            <v-list>
              <v-list-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="`liste des points optenue`" style="text-align:center;color:#199461;font-weight: bold;"></v-list-item-title>
                  </v-list-item-content>
                </template>
                <div style="background-color:#e2e2e2">
                  <v-list-item v-for="element2 in element.table" :key="element2.id">
                    <v-list-item-content>
                      <v-list-item-title v-text="element2.value" :style="`color:`+element2.color"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list-group>
            </v-list>
          </v-list-group>
        </v-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    stat: [],
    text: [
      { text: 'max', id: 0 },
      { text: 'min', id: 1 },
      { text: 'moyenne', id: 2 },
      { text: 'variance', id: 3 },
      { text: 'reponse obtenue', id: 4 }
    ],
    description: `Le site qui te permets de répondre a notre site et d'en voir la statistique`
  }),
  methods: {
    getElement: function (id, id2) {
      let string = ``
      switch (id2) {
        case 0:
          string = this.stat[id].max.value
          break
        case 1:
          string = this.stat[id].min.value
          break
        case 2:
          string = this.stat[id].moyenne
          break
        case 3:
          string = this.stat[id].variance
          break
        case 4:
          string = this.stat[id].answers
          break
      }
      return string
    },
    getColor: function (id, id2) {
      let string = `black`
      switch (id2) {
        case 0:
          string = this.stat[id].max.color
          break
        case 1:
          string = this.stat[id].min.color
          break
      }
      return string
    }
  },
  created () {
    this.axios.get('http://localhost:4000/api/watcher')
      .then(jsondata => {
        this.stat = jsondata.data.stat
        let i = 0
        this.stat.map(element => {
          element.id = i
          i++
        })
      }).catch(error => {
        console.log(`error`, error)
      })
  }
}
</script>

<style scoped>
#img{
  opacity: 1;
}
p{
  font-size:24px;
  user-select: none;
}
#statistique,#description{
  border: solid black;
  width: var(--size);
  --size: calc(50% - 10px);
  margin-left: 10px;
  padding: 10px;
}
#description{
  float:right;
}
</style>
