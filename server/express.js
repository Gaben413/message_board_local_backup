const express = require('express')
const app = express()
const port = 3000

app.set('json spaces', 40)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/json', (req, res) => {
    res.send({a:1})
})

app.get('/json/:number', (req, res) => {
    res.send({number: req.params['number']})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})