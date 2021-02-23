const mongoose = require("mongoose");

const Post = new mongoose.Schema({
    title: String,
    shortDesc: String,
    techs: String,
    body: String,
    image: String,
    hidden: {
        type: Boolean,
        default: false
    },  
    date: { type: Date, default: Date.now },
    url: String
});

module.exports = mongoose.model("Post", Post);