# Breakups

Creating a payment chain for bill splitting needs

api domain: `https:\\breakups.herokuapp.com\`

## API Call Documentations

| Type | Call | Request | Response |
|:-----|:-----|:--------|:---------|
| `GET` | `help` | - | URL to github repository |
| `POST` | `total` | [standard format](#standard-format) | `{ "total": 200 }` |
| `POST` | `perPerson` | [standard format](#standard-format) | `{ "perPerson": 30 }` |
| `POST` | `oweChart` | [standard format](#standard-format) | [standard format](#standard-format) |
| `POST` | `sortedOweChart` | [standard format](#standard-format) | [standard format](#standard-format) |
| `POST` | `paymentChain` | [standard format](#standard-format) | [chain format](#chain-format) |

## Expected Request / Response

### standard format

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

### chain format

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
