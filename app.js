const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const ejs = require('ejs');
const path = require('path');
const Post = require('./models/Post');
const postControllers = require('./controllers/postControllers');
const pageController = require('./controllers/pageController');

const app = express();

// connect db
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/cleanblog-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);

// ROUTES
app.get('/', postControllers.getAllPosts);
app.get('/post/:id', postControllers.getPost);
app.post('/addpost', postControllers.createPost);
app.put('/post/:id', postControllers.updatePost);
app.delete('/post/:id', postControllers.deletePhoto);

app.get('/add_post', pageController.getAddPage);
app.get('/about', pageController.getAboutPage);
app.get('/post/edit/:id', pageController.getEditPage);


// port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda baslatildi...`);
});
