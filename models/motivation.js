var mongoose = require("mongoose");
var Comment = require("./comments");

// define schema
var motivationSchema = new mongoose.Schema({
    title:String,
    image:String,
    summary: String,
    type: String,
    body: String,
    favorites: Number,
    comments: ["commentSchema"],
    author: {
        id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Motivation"
        },
        username:String
    }
})

// model and export
module.exports = mongoose.model("Motivation", motivationSchema);