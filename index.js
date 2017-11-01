var bodyParser = require('body-parser')
var express = require('express')

const got = require('got')
var MIXMAX_API_KEY

var app = express()
var input

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json({
  limit: '100mb',
  type: 'application/json'
}))

app.get('/', function (req, res) {
  res.redirect('https://binhonglee.github.io/Breakups/')
})

app.get('/help', function (req, res) {
  res.redirect('https://github.com/binhonglee/Breakups')
})

app.get('/webapp', function (req, res) {
  res.redirect('https://breakups-webapp.herokuapp.com/')
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
  var sorted1 = mergeSort(oweChart(input.users))
  var sorted2 = mergeSort(oweChart(input.users))
  res.json(paymentNetwork(sorted1, sorted2))
})

app.post('/emailPaymentChain', function (req, res) {
  input = req.body
  MIXMAX_API_KEY = input['mixmax-api']
  var sorted = mergeSort(oweChart(input.users))
  var chain = paymentChain(sorted)
  var emails = []
  for (var i = 0; i < chain.length; i++) {
    var message = messageCreation(sorted[i], sorted[i + 1], chain[i].amount)
    send(message)
    emails.push('Email sent to ' + sorted[i].email)
  }
  res.json(emails)
})

app.listen(5000)
// app.listen(process.env.PORT)

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
    while (users[i + 1].amount === 0) {
      users.splice((i + 1), 1)
    }

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

function paymentNetwork (users, backup) {
  var chain = []

  while (chain.length < users.length && backup.length > 1) {
    if (backup.length > 0 && backup[0].amount === 0) {
      backup.splice(0, 1)
    } else if ((0 !== (backup.length - 1)) && (backup[0].amount === (backup[backup.length - 1].amount * -1))) {
      chain.push(createItem(backup[0].name, backup[backup.length - 1].name, backup[backup.length - 1].amount))
      backup.splice((0), 1)
      backup.splice((backup.length - 1), 1)
    } else if (backup[0].amount * -1 < (backup[backup.length - 1].amount)) {
      chain.push(createItem(backup[0].name, backup[backup.length - 1].name, backup[0].amount * -1))
      backup[backup.length - 1].amount += backup[0].amount
      backup.splice((0), 1)
    } else {
      chain.push(createItem(backup[0].name, backup[backup.length - 1].name, backup[backup.length - 1].amount))
      backup[0].amount += backup[backup.length - 1].amount
      backup.splice((backup.length - 1), 1)
    }
  }
  
  if (backup.length > 1) {
    return paymentChain(users)
  } else {
    return chain
  }
}

function createItem (from, to, amount) {
  console.log('from: ' + from + ' to: ' + to + ' amount: ' + amount)
  var item = {'from': '', 'to': '', 'amount': 0}
  item['from'] = from
  item['to'] = to
  item['amount'] = amount
  return item
}

function messageCreation (user1, user2, amount) {
  var signature = '<br><br><p>Sincerely,<br><a href="https://github.com/binhonglee/Breakups">BreakupBills</a></p>'
  var message = {}
  message.to = user1.email
  message.subject = 'Pay ' + user2.name + ' $' + amount
  message.html = '<p>Please pay ' + user2.name + ' $' + amount + '</p>' + signature
  return message
}

function send (message) {
  got.post('https://api.mixmax.com/v1/send', {
    body: JSON.stringify({
      message
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Token': MIXMAX_API_KEY
    }
  })
}
