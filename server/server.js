const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

const app = express()

app.use(session({
  secret: 'soleil',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))
const users = [
  { ID: `louis`, MDP: `cherel` }
]
let server = {
  users: users,
  quizz: {
    theme: [],
    question: [],
    stat: []
  },
  puissance: 1000,
  fs: require('fs')
}
function save (path, array) {
  server.fs.writeFile(path, JSON.stringify(array), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file ' + path.split('//') + ' is save')
  })
}

app.post('/api/connect', (req, res) => {
  const user = server.users.find(u => u.ID === req.body.login && u.MDP === req.body.password)
  let connection = true
  if (!user) {
    connection = false
  }
  const value = {
    connect: connection,
    error: `Votre compte n'existe pas!`
  }
  res.json(value)
})

app.get('/api/watcher', (req, res) => {
  let variable = []
  server.quizz.stat.forEach(element => {
    let variable2 = {
      theme: server.quizz.theme.find(element2 => element2.id === element.id).text,
      answers: element.answers,
      max: {
        value: 0,
        color: element.max.color
      },
      min: {
        value: 0,
        color: element.min.color
      },
      moyenne: 0,
      variance: 0,
      table: element.table
    }
    if (variable2.answers !== 0) {
      variable2.max.value = element.max.value
      variable2.min.value = element.min.value
      variable2.moyenne = element.somme / element.answers
      variable2.variance = server.puissance * element.sommeCarre / element.answers - Math.pow(variable2.moyenne, 2)
    }
    variable.push(variable2)
  })
  res.json({ stat: variable })
})

app.get('/api/quizz/list', (req, res) => {
  res.json({
    quizz: server.quizz.theme
  })
})

app.post('/api/quizz/question', (req, res) => {
  res.json({
    quizz: server.quizz.question.find(e => req.body.id === e.id)
  })
})

app.post('/api/quizz/reponse', (req, res) => {
  let id = server.quizz.theme.findIndex(element => element.id === req.body.id)
  if (typeof req.body.score.value !== 'number' || typeof req.body.score.color !== 'string') {
    const message = `Requête mal tappé`
    console.log(message)
    res.status(400)
    res.json({ message: message })
    return
  } else if (id === -1) {
    const message = `Aucun identifiant ne correspond au thème`
    console.log(message)
    res.status(400)
    res.json({ message: message })
    return
  }
  server.quizz.stat[id].answers += 1
  if (server.quizz.stat[id].max.value < req.body.score.value) {
    server.quizz.stat[id].max.value = req.body.score.value
    server.quizz.stat[id].max.color = req.body.score.color
  }
  if (server.quizz.stat[id].min.value > req.body.score.value) {
    server.quizz.stat[id].min.value = req.body.score.value
    server.quizz.stat[id].min.color = req.body.score.color
  }
  server.quizz.stat[id].table.push({ value: req.body.score.value, color: req.body.score.color })
  server.quizz.stat[id].somme += req.body.score.value
  server.quizz.stat[id].sommeCarre += req.body.score.value * req.body.score.value / server.puissance
  res.end()
})

app.post('/api/supprimer', (req, res) => {
  const id = server.quizz.stat.findIndex(element => req.body.id === element.id)
  if (id !== -1) {
    const variable = {
      id: req.body.id,
      max: {
        value: -10000,
        color: ''
      },
      min: {
        value: 10000,
        color: ''
      },
      somme: 0,
      sommeCarre: 0,
      answers: 0,
      table: []
    }
    server.quizz.stat[id] = variable
    res.json({})
  } else {
    res.error(404)
    res.end()
  }
})

app.post('/api/save', (req, res) => {
  save('./server/data/stat.json', server.quizz.stat)
  save('./data/quizzs.json', server.quizz.theme)
  save('./data/quizz.json', server.quizz.question)
  res.end()
})

app.post('/api/quizz/theme/id', (req, res) => {
  if (typeof req.body.theme === 'string') {
    res.json({
      id: server.quizz.theme.find(element => element.text === req.body.theme).id
    })
  } else {
    res.error(404)
    res.end()
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.clear()
  server.quizz.theme = require(`./data/quizzs.json`)
  server.quizz.question = require(`./data/quizz.json`)
  server.quizz.stat = require(`./data/stat.json`)
  console.log(`Le port d'écoute est le ` + port)
})
