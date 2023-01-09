# CleanBlog

## Bölüm 1

- CleanBlog proje klasörünü oluşturalım.

```bash
mkdir CleanBlog
```

- Package.json dosyasını oluşturalım.

```bash
npm init
```

```json
"start": "nodemon app.js -L"
```

- Prettier ayarlarını yapalım.(İsteğe bağlı)

```bash
npm install prettier -D --save-exact
```

```json
{
  "tabWidth": 4,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

- Express ve Nodemon modüllerini indirelim.

```bash
npm i express --save
npm install --save-dev nodemon
```

- git init ile lokal repomuzu oluşturalım.

```bash
git init
```

- get request içerisinde const blog = { id: 1, title: "Blog title", description: "Blog description" }, içeriğini gönderelim.

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    const blog = {
        id: 1,
        title: 'Blog title',
        description: 'Blog description',
    };

    res.send(blog);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda baslatildi...`);
});
```

- .gitignore dosyası oluşturalım ve ilk repomuzu gönderelim.
<https://www.toptal.com/developers/gitignore/api/node>

---

## Bölüm 2

- Public klasörü oluşturup statik dosyalarımızı içerisine yerleştirelim.

<p align="center"><img src="./image/static-folder.jpg"/></p>

- İlgili middleware fonksiyonunu yazarak public klasörümüzü uygulamamıza kaydedelim.

```js
const path = require('path');

// MIDDLEWARES
app.use(express.static('public'));

// ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/index.html'));
});
```

- EJS modülünü indirelim.

```bash
npm i ejs
```

```json
"ejs": "^3.1.8"
```

- Uygulamamızda EJS modülünü kullanacağımızı belirtelim.

```js
const ejs = require('ejs');

// TEMPLATE ENGINE
app.set('view engine', 'ejs');
```

- Views klasörü oluşturalım ve tüm .html dosyalarımız views klasörü içerisinde .ejs dosyalarına çevirelim.

<p align="center"><img src="./image/ejs.jpg"/></p>

- Partials klasör yapısını oluşturalım.

<p align="center"><img src="./image/partials.jpg"/></p>

- İlgili yönlendirmeleri ve _navigation.ejs klasöründeki link düzenlemelerini yapalım.

<p align="center"><img src="./image/_navigation.jpg"/></p>

```js
<%- include('./partials/_header.ejs') -%>
<%- include('./partials/_navigation.ejs') -%>
<%- include('./partials/_footer.ejs') -%>
```

<p align="center"><img src="./image/ejs_html.jpg"/></p>

```html
<!-- ... -->
<a class="navbar-brand" href="/">Clean Blog</a>
<!-- ... -->
<ul class="navbar-nav ml-auto">
    <li class="nav-item">
        <a class="nav-link" href="/">Home</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="about">About</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="add_post">Add New Post</a>
    </li>
</ul>
```

```js
// ROUTES
app.get('/', (req, res) => {
    res.render('index'); 
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
```

---

## Bölüm 3

- cleanblog-test-db adında bir veri tabanı için mongoose ile gerekli bağlantı bilgilerini yazalım.

```bash
npm i mongoose
```

```js
/// App.js
// ...
const mongoose = require('mongoose');
// ...
// connect db
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/cleanblog-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
```

- "Add New Post" sayfamızdan göndericeğimiz veriler req.body ile yakalayalım, gerekli middleware fonksiyonarını kullanalım.

```js
// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

```js
app.post('/addpost', async (req, res) => {
    console.log(req.body);
    res.redirect('/');
});
```

```html
<!-- add_post.ejs -->
<!-- ... -->
<form method="POST" action="addpost" novalidate>
<!-- ... -->
<input type="text" name="title" class="form-control" placeholder="Name" id="name" required>
<!-- ... -->
<textarea rows="5" name="detail" class="form-control" placeholder="Message" id="message" required
<!-- ... -->
```

- title:String, detail:String, dateCreated:Date(default now) özelliklerine sahip Post modelini oluşturalım.

<p align="center"><img src="./image/models.jpg"/></p>

```js
/// Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create schema
const PostSchema = new Schema({
    title: String,
    detail: String,
    date: { type: Date, default: Date.now },
});

// model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
```

- Veri tabanımızda 3 adet pos dökümanı oluşturalım.

```js
/// App.js
// ...
const Post = require('./models/Post');
// ...
app.post('/addpost', async (req, res) => {
    await Post.create(req.body);
    res.redirect('/');
});
// ...
```

<p align="center"><img src="./image/cleanblog-test-db-3entry.jpg"/></p>

- Oluşturduğumuz post dökümanlarını Blog sitemizin anasayfasında gösterelim.

```js
/// App.js
// ...
// ROUTES
app.get('/', async (req, res) => {
    const addpost = await Post.find({});
    res.render('index', {
        addpost,
    });
});
// ...
```

```js
/// index.ejs
// ...
<div class="post-preview">

<% addpost.forEach( element=> { %>

    <a href="./post">
    <h2 class="post-title">
        <%= element.title %>
    </h2>
    <h3 class="post-subtitle">
        <%= element.detail %>
    </h3>
    </a>
    <p class="post-meta">Posted by
    <a href="https://github.com/livinlargeinvenus">livinlargeinvenus</a>
    on <%= element.date.toString().split(" ").slice(1, 4).join(" ") %>
    </p>

<% }) %>

</div>
// ...
```

<p align="center"><img src="./image/cleanblog-website-1.jpg"/></p>

---

## Bölüm 4

- index.ejs içerisinde **/posts/<%= posts[i]._id %> ile _id** bilgisini gönderelim.

```js
// index.ejs
// ...
<a href="/post/<%= element._id %>">
// ...
```

- app.js içerisinde GET metoduyla "/posts/:id" ile gönderilen "_id" yi yakalayalım.

```js
// app.js
// ...
app.get('/post/:id', async (req, res) => {
    console.log(req.params.id);
});
// ...
```

- tekil post bilgilerini post.ejs dosyasına gönderelim.

```js
// app.js
// ...
app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', {
        post,
    });
});
// ...
```

- post.ejs içerisine post.title, post.detail ve post.dateCreated bilgilerini gönderelim. (her bir post için ayrı image kullanmayacağız)

```js
// post.ejs
// ...
<div class="post-heading">
    <h1><%= post.title %></h1>
    <h2 class="subheading"><%= post.subtitle %></h2>
    <span class="meta">Posted by
        <a href="/"><%= post.author %></a>
        on <%= post.date.toString().split(" ").slice(1, 4).join(" ") %>
    </span>
</div>
// ...
<!-- Post Content -->
<article>
<div class="container">
    <div class="row">
    <div class="col-lg-8 col-md-10 mx-auto">
        <%= post.detail %>
    </div>
    </div>
</div>
</article>
// ...
```

---

## Bölüm 5

- post.ejs template içerisinde UPDATE ve DELETE butonu oluşturalım.

```html
<div class="container">
    <div class="row">
    <div class="col-10">
        <div class="text-justify">
        <%= post.detail %>
        </div>
    </div>
    <div class="col-2">
        <div class="text-center">
        <button class="btn btn-primary mt-5 mb-3 btn-block" href="#"><span>Update</span></button>
        <button class="btn btn-danger mb-3 btn-block" href="#"><span>Delete</span></button>
        </div>
    </div>
    </div>
</div>
```

- Herhangi bir post verisini güncellemek için gerekli çalışmaları yapalım.

```bash
npm install method-override
```

```js
// app.js
// ...
const methodOverride = require('method-override');
// ...
```

```js
// app.js
// ...
// MIDDLEWARES
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);
// ...

```

```js
// app.js
// ...
app.get('/post/edit/:id', async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id });

    res.render('edit', {
        post,
    });
});

app.put('/post/:id', async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id });

    post.author = req.body.author;
    post.title = req.body.title;
    post.subtitle = req.body.subtitle;
    post.detail = req.body.detail;
    post.save();

    res.redirect(`/post/${req.params.id}`);
});

// ...

```

```html
<!-- ... -->
<!-- edit.js -->
<form method="POST" action="/post/<%= post._id %>?_method=PUT" " novalidate>
<!-- ... -->
<input type="text" value="<%= post.author %>" name="author" class="form-control" placeholder="Author" id="name" required
data-validation-required-message="Please enter your name.">
<!-- ... -->
<input type="text" name="title" class="form-control" placeholder="Title" value="<%= post.title %>" id="name" required
data-validation-required-message="Please enter your title.">
<!-- ... -->
<input type="text" name="subtitle" value="<%= post.subtitle %>" class="form-control" placeholder="Subtitle" id="name" required
data-validation-required-message="Please enter your title.">
<!-- ... -->
<textarea rows="5" name="detail" class="form-control" placeholder="Content" id="message" required
data-validation-required-message="Please enter a content."><%= post.detail %></textarea>
<!-- ... -->
```

```html
<!-- ... -->
<!-- post.ejs -->
<a href="/post/edit/<%= post._id %>" class="btn btn-primary mt-5 mb-3 btn-block"><span>Update</span></a>
<!-- ... -->
```

- Herhangi bir post verisini silmek için gerekli çalışmaları yapalım.

```js
// app.js
// ...
app.delete('/post/:id', async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id });

    await Post.findByIdAndRemove(req.params.id);

    res.redirect('/');
});
// ...
```

```html
<!-- post.ejs -->
<!-- ... -->
<a href="/post/<%= post._id %>?_method=DELETE" class="btn btn-danger mb-3 btn-block" onclick="return confirm('ARE YOU SURE?')"><span>Delete</span></a>
<!-- ... -->
```

- Kodumuzu MVC yapısına göre tekrar düzenleyelim.

<p align="center"><img src="./image/controllers.png"/></p>

```js
// app.js
// ...
const postControllers = require('./controllers/postControllers');
const pageController = require('./controllers/pageController');
// ...
// ROUTES
app.get('/', postControllers.getAllPosts);
app.get('/post/:id', postControllers.getPost);
app.post('/addpost', postControllers.createPost);
app.put('/post/:id', postControllers.updatePost);
app.delete('/post/:id', postControllers.deletePhoto);

app.get('/add_post', pageController.getAddPage);
app.get('/about', pageController.getAboutPage);
app.get('/post/edit/:id', pageController.getEditPage);
// ...
```

```js
// pageController.js
const Post = require('../models/Post');

exports.getAddPage = (req, res) => {
    res.render('add_post');
};

exports.getAboutPage = (req, res) => {
    res.render('about');
};

exports.getEditPage = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id });

    res.render('edit', {
        post,
    });
};
```

```js
// postControllers.js
const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
    const addpost = await Post.find({}).sort('-date');
    res.render('index', {
        addpost,
    });
};

exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', {
        post,
    });
};

exports.createPost = async (req, res) => {
    await Post.create(req.body);
    res.redirect('/');
};

exports.updatePost = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id });

    post.author = req.body.author;
    post.title = req.body.title;
    post.subtitle = req.body.subtitle;
    post.detail = req.body.detail;
    post.save();

    res.redirect(`/post/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id });

    await Post.findByIdAndRemove(req.params.id);

    res.redirect('/');
};
```

---

## Bölüm 6

- Uygulamamızı HEROKU ve MongoDB Atlas ücresiz servislerini kullanarak yükleyelim.

![deploying](./image/deploy.png)
