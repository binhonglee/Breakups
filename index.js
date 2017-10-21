var bodyParser = require('body-parser')
var express = require('express')

var app = express()
var input

app.use(bodyParser.json({
  limit: '100mb',
  type: 'application/json'
}))
app.get('/help', function (req, res) {
  res.send('https://github.com/binhonglee/Breakups')
})
app.post('/total', function (req, res) {
  input = req.body
  var toReturn = { 'total': 0 }
  toReturn.total = total(input.users)
  res.json(toReturn)
})
app.post('/perPerson', function (req, res) {
  input = req.body
  var toReturn = { 'perPerson': 0 }
  toReturn.perPerson = (total(input.users)) / input.users.length
  res.json(toReturn)
})
app.post('/oweChart', function (req, res) {
  input = req.body
  var perPerson = total(input.users) / input.users.length
  for (var i = 0; i < input.users.length; i++) {
    input.users[i].amount -= perPerson
  }
  res.json(input)
})
// app.listen(3000)
app.listen(process.env.PORT)

function total (input) {
  var total = 0
  for (var i = 0; i < input.length; i++) {
    total += input[i].amount
  }

  return total
}
