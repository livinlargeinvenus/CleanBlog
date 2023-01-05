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
