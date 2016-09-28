var mongoose = require("mongoose")
var Comment = require("./comments")

var articleSchema = new mongoose.Schema({
    title: String,
    image: String,
    flag: String,
    summary: String,
    body: String,
    favorited: Boolean,
    disliked: Boolean,
    liked: Boolean,
    likes: 0,
    comments: ["commentSchema"],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article"
        },
        username: String
    }
})

module.exports = mongoose.model("Article", articleSchema);