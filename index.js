const express = require('express');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors())

let notes = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "small",
    "number": "789",
    "id": 5
  }
]

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/info', (request, response) => {
  response.send(`<div>phonebook has info for ${notes.length} people</div><div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => {
    // console.log('id', id, typeof id, 'note.id', typeof note.id, note.id, note.id === id)
    return note.id === id
  })
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes.forEach((item) => {
    if (item.id === id) {
      item.name = request.body.name
      item.number = request.body.number
    }
  })
})

const generateId = () => {
  return Math.random(0, 10000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    console.log(body)
    return response.status(400).json({
      error: 'missing name'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'missing number'
    })
  } else if (notes.some(note => note.name === body.name)) {
    return response.status(400).json({
      error: '名字重复'
    })
  }
  
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  notes = notes.concat(person)

  response.json(person)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})