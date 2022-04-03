const express = require('express')
const axios = require('axios')
const path = require('path')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', async(req, res) => {

    let home_obj = null

    let page = req.query.page

    if (page = "undefined") {
        page = 1
    }

    user = await axios.get(`http://localhost:7071/api/home-trigger?page=${page}`).then(resp => {
        home_obj = resp.data.dbResult
    })

    console.log(home_obj[0])

    res.render('pages/index', {
        home_obj
    })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/user/:userid', async(req, res) => {

    let user_obj = null

    user = await axios.get(`http://localhost:7071/api/user-trigger?userid=${req.params.userid}`).then(resp => {
        user_obj = resp.data.result[0]
    })

    res.render('pages/user', {
        user_obj
    })
})
