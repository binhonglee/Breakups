# Breakups

Creating a payment chain for bill splitting needs

[![Dependency Status](https://gemnasium.com/badges/github.com/binhonglee/Breakups.svg)](https://gemnasium.com/github.com/binhonglee/Breakups)

api domain: `https:\\breakups.herokuapp.com\`

## API Call Documentations

| Type | Call | Request | Response |
|:-----|:-----|:--------|:---------|
| `GET` | `help` | - | URL to github repository |
| `POST` | `total` | [standard](#standard) / [email](#email) | `{ "total": 200 }` |
| `POST` | `perPerson` | [standard](#standard) ／ [email](#email) | `{ "perPerson": 30 }` |
| `POST` | `oweChart` | [standard](#standard) ／ [email](#email) | [standard](#standard) ／ [email](#email) |
| `POST` | `sortedOweChart` | [standard](#standard) ／ [email](#email) | [standard](#standard) ／ [email](#email) |
| `POST` | `paymentChain` | [standard](#standard) ／ [email](#email) | [chain](#chain) |
| `POST` | `emailPaymentChain` | [email](#email) | `["Email sent to user1@domain.com", "Email sent to user2@domain.com"]` |

## Expected Request / Response

### standard

```JSON
{
  "users": [
    {
      "name": "Person1",
      "amount": 100
    },
    {
      "name": "Person2",
      "amount": 50
    },
    {
      "name": "Person3",
      "amount": 30
    }
  ]
}
```

### chain

```JSON
[
  {
    "from": "Person2",
    "to": "Person3",
    "amount": 10
  },
  {
    "from": "Person3",
    "to": "Person1",
    "amount": 40
  }
]
```

### email

```JSON
{
  "users": [
    {
      "name": "Person1",
      "email": "person1@domain.com",
      "amount": 100
    },
    {
      "name": "Person2",
      "email": "person2@domain.com",
      "amount": 50
    },
    {
      "name": "Person3",
      "email": "person3@domain.com",
      "amount": 30
    }
  ],
  "mixmax-api": "your-mixmax-api-key"
}
```
