<template>
  <div>
    <div id="toolbar">
      <v-card>
        <v-list>
          <v-list-item @click="ajouter" :style="backgroundColor.action === `ajouter` ? `background-color:green` : ``">
            <v-list-item-content>
              <v-list-item-title id="button">AJOUTER DES DONNEES AU SITE</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-divider inset ></v-divider>
      <v-card>
        <v-list>
          <v-list-item @click="supprimer" :style="backgroundColor.action === `supprimer` ? `background-color:orange` : ``">
            <v-list-item-content>
              <v-list-item-title id="button">SUPPRIMER DES DONNEES DU SITE</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-divider inset></v-divider>
      <v-card :loading="dialog.tmp.save.loading">
        <v-list>
          <v-list-item @click="save">
            <v-list-item-content>
              <v-list-item-title id="button">SAUVEGARDER LES DONNEES DU SITE</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-divider inset></v-divider>
    </div>
    <div id="statistique">
      <p style="text-align:center;height:content;"><b>statistique</b></p>
      <div v-for="element in stat" :key="element.id">
        <v-list>
          <v-list-group>
            <template v-slot:activator>
              <v-list-item-content :id="`title_`+backgroundColor.action" @click="clicked(element.id)">
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
    <v-dialog v-model="dialog.list.ajouter" max-width="25%">
      <v-card>
        <v-card-title style="text-align:center">Valeur à ajouter</v-card-title>
        <v-text-field label="Ajouter ici" v-model="dialog.tmp.ajouter"></v-text-field>
      </v-card>
      <v-btn @click="clicked2">Enregistrer</v-btn>
    </v-dialog>
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
    backgroundColor: {
      action: ``
    },
    dialog: {
      list: {
        ajouter: false
      },
      tmp: {
        id: 0,
        ajouter: 0,
        save: { loading: false }
      }
    }
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
    },
    ajouter: function () {
      if (this.backgroundColor.action === 'ajouter') {
        this.backgroundColor.action = ''
      } else {
        this.backgroundColor.action = 'ajouter'
      }
    },
    supprimer: function () {
      if (this.backgroundColor.action === 'supprimer') {
        this.backgroundColor.action = ''
      } else {
        this.backgroundColor.action = 'supprimer'
      }
    },
    save: function () {
      this.backgroundColor.action = 'sauvegarder'
      this.dialog.tmp.save.loading = true
      this.axios.post('/api/save')
        .then(jsondata => { setTimeout(() => (this.dialog.tmp.save.loading = false), 1000) })
        .catch(error => { console.log(error) })
    },
    getData: function () {
      this.axios.get('/api/watcher')
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
    },
    clicked: function (id) {
      this.dialog.tmp.id = id
      if (this.backgroundColor.action === `ajouter`) {
        this.dialog.list.ajouter = true
      } else if (this.backgroundColor.action === `supprimer`) {
        this.axios.post('/api/quizz/theme/id', { theme: this.stat[this.dialog.tmp.id].theme })
          .then(jsondata => {
            const id = jsondata.data.id
            this.axios.post('/api/supprimer', { id: id })
              .then(jsondata => {
                this.getData()
              }).catch(error => console.log(error))
          }).catch(error => console.log(error))
      }
    },
    clicked2: function () {
      if (this.backgroundColor.action === `ajouter`) {
        this.dialog.tmp.ajouter = parseInt(this.dialog.tmp.ajouter, 10)
        if (!isNaN(this.dialog.tmp.ajouter)) {
          this.axios.post('/api/quizz/theme/id', { theme: this.stat[this.dialog.tmp.id].theme })
            .then(jsondata => {
              const id = jsondata.data.id
              this.axios.post('/api/quizz/reponse', { id: id, score: { value: this.dialog.tmp.ajouter, color: 'black' } })
                .then(jsondata => {
                  this.getData()
                  this.dialog.tmp.ajouter = 0
                  this.dialog.list.ajouter = false
                }).catch(error => console.log(error))
            }).catch(error => console.log(error))
        }
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
#toolbar{
  width:400px;
  float:left;
  height: 1000px;
}
#toolbar #button{
  text-align:center;
}
#statistique{
  width: calc(100% - 400px);
  float: left;
  margin-top: 20px;
}
#statistique #title_ajouter:hover{
  background-color:green;
}
#statistique #title_supprimer:hover{
  background-color:orange;
}
</style>
