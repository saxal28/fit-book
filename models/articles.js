var mongoose = require("mongoose")
var Comment = require("./comments")

var articleSchema = new mongoose.Schema({
    title: String,
    image: String,
    flag: String,
    summary: String,
    body: String,
    comments: ["commentSchema"]
})

module.exports = mongoose.model("Article", articleSchema);