const express = require('express')
const axios = require('axios')
const path = require('path')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded());

app.get('/', async(req, res) => {

    let home_obj = null

    let page = req.query.page

    if (!req.query.page) {
        page = 1
    }

    user = await axios.get(`https://blog-functions.azurewebsites.net/api/home-trigger?page=${page}`).then(resp => {
        home_obj = resp.data.dbResult
    })

    res.render('pages/index', {
        data: {
            "page": page,
            "home_obj": home_obj
        }
    })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/user/:userid', async(req, res) => {

    let user_obj = null

    user = await axios.get(`https://blog-functions.azurewebsites.net/api/user-trigger?userid=${req.params.userid}`).then(resp => {
        user_obj = resp.data.result[0]
    })

    res.render('pages/user', {
        user_obj
    })
})

app.get('/post/:postid', async(req, res) => {

    let post_obj = null
    let comments_obj = null

    post = await axios.get(`https://blog-functions.azurewebsites.net/api/post-trigger?postid=${req.params.postid}`).then(resp => {
        post_obj = resp.data.message
    })

    comments = await axios.get(`https://blog-functions.azurewebsites.net/api/comments-trigger?postid=${req.params.postid}`).then(resp => {
        comments_obj = resp.data.dbResult
    })

    res.render('pages/post', {
        data: {
            "post_obj": post_obj,
            "comments_obj": comments_obj
        }
    })
})

app.post('/post/:postid', async(req, res) => {

    if (req.body.text) {
        comment = await axios.post(`https://blog-functions.azurewebsites.net/api/comments-trigger`, 
            {
                "text": req.body.text,  
                "post_id": req.params.postid,
                "user_id": 99999999
            }
        )
    
        res.redirect(`/post/${req.params.postid}`)
    } else if (req.body.deletecomment) {
        comment = await axios.post(`https://blog-functions.azurewebsites.net/api/comments-trigger?deletecomment=${req.body.deletecomment}`)
        
        res.redirect(`/post/${req.params.postid}`)
    }
    
})