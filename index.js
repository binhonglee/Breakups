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
  input.users = oweChart(input.users)
  res.send(input)
})

app.post('/sortedOweChart', function (req, res) {
  input = req.body
  input.users = mergeSort(oweChart(input.users))
  res.send(input)
})

app.post('/paymentChain', function (req, res) {
  input = req.body
  res.json(paymentChain(mergeSort(oweChart(input.users))))
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

function oweChart (users) {
  var perPerson = total(users) / users.length
  for (var i = 0; i < users.length; i++) {
    users[i].amount -= perPerson
  }

  return users
}

function mergeSort (users) {
  if (users.length < 2) {
    return users
  }

  var middle = Math.floor(users.length / 2)
  var left = users.slice(0, middle)
  var right = users.slice(middle)

  return merge(mergeSort(left), mergeSort(right))
}

function merge (left, right) {
  var result = []
  var il = 0
  var ir = 0

  while (il < left.length && ir < right.length) {
    if (left[il].amount < 0 && right[ir].amount < 0) {
      if (left[il].amount > right[ir].amount) {
        result.push(left[il++])
      } else {
        result.push(right[ir++])
      }
    } else {
      if (left[il].amount < right[ir].amount) {
        result.push(left[il++])
      } else {
        result.push(right[ir++])
      }
    }
  }

  return result.concat(left.slice(il)).concat(right.slice(ir))
}

function paymentChain (users) {
  var chain = []
  var stack = 0

  for (var i = 0; i < users.length - 1; i++) {
    var item = {'from': '', 'to': '', 'amount': 0}
    item['from'] = users[i].name
    item['to'] = users[i + 1].name
    var amount = users[i].amount * -1
    stack += amount
    item['amount'] = stack
    chain.push(item)
  }

  return chain
}
