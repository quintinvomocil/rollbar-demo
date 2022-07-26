const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: 'f272f5fe3a724e98b616fecc7073e47b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info('Someone loaded up your HTML')
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info('someone got the list of students to load')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           rollbar.log("Student added successfully", {author: "Q",
        type: "manual entry"})
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
        rollbar.error('No name provided')   
        res.status(400).send('You must enter a name.')
       } else {
        rollbar.error('Student already exists')   
        res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    rollbar.info('Student was deleted')
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
