const express = require('express')
const axios = require('axios')
const path = require('path')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/user', async(req, res) => {

    user = await axios.get("http://localhost:7071/api/user-trigger?userid=203416")

    console.log(user)

    res.render('pages/user')
})
