var mongoose = require("mongoose");
var Comment = require("./comments");

// define schema
var questionSchema = new mongoose.Schema({
    title: String,
    body: String,
    comments: ["commentSchema"],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        },
        username: String
    }
})

// model setup && export
module.exports = mongoose.model("Question", questionSchema);