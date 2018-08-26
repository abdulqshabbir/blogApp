const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dbUrl = 'mongodb://test:test123@ds259351.mlab.com:59351/free-code-camp-mongodb'
const methodOverride = require('method-override')
const connect        = require('connect')
const ejs = require('ejs')
const app = express()

app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
    }))
    
    app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
 //App preferences
 app.set('view engine', 'ejs')
 app.use(express.static('public'))
 app.use(bodyParser.urlencoded({extended: true}))
 app.use(methodOverride('_method'))
mongoose.connect(dbUrl, {useNewUrlParser: true}, (err, db) => {
    if(err) {//error connecting to the database
        console.log(err)
        return
    }
    //sucessful connection to database
    console.log('connected to dababse')//c

   

    var bodyParser     = require('body-parser')
    var methodOverride = require('method-override')
    
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

    // -------------------- EDIT/UPDATE ROUTE --------------------
    /*
        1. Add edit route
        2. Add edit form
        3. Add update route
        4. Add update form
        5. Add mehtod-override
    */

    // EDIT ROUTE for a particular blog's edit form
    app.get('/blogs/:id/edit', (req, res) => {
        let blogId = req.params.id
        console.log(req.params)

        Blog.findById(blogId, (err, blogFound) =>{
            if(err) {
                console.log(err)
                return
            } else {//blog with id given has been found
                res.render('edit', {blog: blogFound})
            }
        })
    })

    //UPDATE ROUTE
    app.put('/blogs/:id', (req, res) => {
        let editedBlogId = req.params.id
        Blog.findByIdAndUpdate(editedBlogId, {$set: req.body.blog}, {new: true}, (err, updatedBlog) => {
            if (err) {
                console.log(err) 
                res.redirect('/blogs')
            } else {
                console.log('Blog was upadated to ', updatedBlog)
                res.redirect('/blogs/' + editedBlogId)
            }
        })
    })

    //------------------- END OF RESTful ROUTES -------------------//
    //Listen on port 3000 
    app.listen(3000, () => {
        console.log('server is listening')
    })
})

//title, image, body, created_on


