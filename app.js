const express = require('express');
const mongoose = require('mongoose');

const ejs = require('ejs');
const path = require('path');
const Post = require('./models/Post');

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

// ROUTES
app.get('/', async (req, res) => {
    const addpost = await Post.find({});
    res.render('index', {
        addpost,
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/add_post', (req, res) => {
    res.render('add_post');
});

app.get('/post', (req, res) => {
    res.render('post');
});

app.post('/addpost', async (req, res) => {
    await Post.create(req.body);
    res.redirect('/');
});

// port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda baslatildi...`);
});
