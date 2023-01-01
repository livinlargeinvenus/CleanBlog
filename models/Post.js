const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const PostSchema = new Schema({
    author: String,
    title: String,
    subtitle: String,
    detail: String,
    date: { type: Date, default: Date.now },
});

// model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
