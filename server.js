const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const dbUrl = 'mongodb://test:test123@ds259351.mlab.com:59351/free-code-camp-mongodb'
const ejs = require('ejs')

mongoose.connect(dbUrl, {useNewUrlParser: true}, (err, db) => {
    if(err) {//error connecting to the database
        console.log(err)
        return
    }
    //sucessful connection to database
    console.log('connected to dababse')//c

    //App preferences
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({extended: true}))

    let blogSchema = new mongoose.Schema({
        title: String, 
        image: String, 
        body: String,
        created: {type: Date, default: Date.now}
    })

    //Turn blog schema into a model for mongoose methods
    let Blog = mongoose.model('Blog', blogSchema)

    //-------------------  RESTful ROUTES  ------------------------//
    
    //-------------INDEX ROUTE --------------
    app.get('/', (req, res) => {
        res.redirect('/blogs')
    })
    app.get('/blogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if(err) {
                console.log(err)
                return
            }
            res.render('index', {blogs: blogs})
        })
    })

    //------------NEW ROUTE ---------------
    app.get('/blogs/new', (req, res) => {
        res.render('new')
    })
    app.post('/blogs', (req, res) => {
        //process request from req.body 
        console.log(req.body.blog)

        //create new blog and save to database
        Blog.create(req.body.blog, (err, newBlog) => {
            if(err) {
                console.log(err)
            } else {
                //re-direct to homepage to show new blog post
                res.redirect('/blogs')
            }
        })
    })

    // -------------------- SHOW ROUTE --------------- 
    /* 
        1. GET request to /blogs/:id
        2. Get id of particular blog upon click
        3. Re-direct to /blogs/show
    */

    app.get('/blogs/:id', (req, res) => {
        let blogId = req.params.id

        // Retrieve the 'show blog' with the particular id from database
        Blog.findById(blogId, (err, showBlog) => {
            if(err) {
                console.log(err)
            } else {
                // Redirect to the 'show' page
                // Pass through all information for that particular blog
                res.render('show', {blog: showBlog})
            }
        })
    }) 

    // -------------------- EDIT ROUTE --------------------

    //------------------- END OF RESTful ROUTES -------------------//
    //Listen on port 3000 
    app.listen(3000, () => {
        console.log('server is listening')
    })
})

//title, image, body, created_on


