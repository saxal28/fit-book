var mongoose = require("mongoose");
var Article = require("./models/articles");
var Recipe = require("./models/recipes");
var Comment = require("./models/comments");

var data = [
    {title: "Article 1", image: 'https://hd.unsplash.com/photo-1439886183900-e79ec0057170', flag:"bodybuilding", summary:"Just a test summary", body:"blah blah blah blah"},
    {title: "Article 2", image: 'http://i2.mirror.co.uk/incoming/article8075004.ece/ALTERNATES/s615b/Harambe.jpg', flag:"nutrition", summary:"This article is for Harambe", body:"blah blah blah blah"},
    {title: "Article 3", image: 'http://i.imgur.com/egzJbiI.gif', flag:"bodybuilding", summary:"Just a test summary", body:"blah blah blah blah"}
    ];


function seedDB(){
    //remove all articles
    Article.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("removed articles!")
    });
    
    //add some articles
    data.forEach(function(item) {
        Article.create(item, function(err, article) {
            if(err) {
                console.log(err)
            } else {
                console.log("added article!")
                 //add article comments
                Comment.create(
                    {text:"This is great!", author:"Alan"}, 
                    function(err, comment) {
                        if(err){
                            console.log(err);
                        } else {
                       article.comments.push(comment);
                       article.save();
                       console.log("Created new comment");
                        }
                });
            }
        });
    });
}

module.exports = seedDB




// CREATE RECIPE
// Recipe.create({
//     title: "Wild Pancakes",
//     image: "https://hd.unsplash.com/photo-1462188769884-495d009c7f03",
//     instructions: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//     calories: "800",
//     carb: "60",
//     protein: "45",
//     fat: "3",
//       step1: "Hi",
// }, function() {
//     console.log("created recipe!");
// });

//CREATE ARTICLE
// Article.create({
//     title: "Article Example",
//     image: "http://images.wisegeek.com/barbell-with-weights.jpg",
//     flag: "Weightlifting",
//     summary: "An article about weightlifting",
//     body: "Succulents gentrify small batch poutine chicharrones intelligentsia, cornhole pork belly butcher pitchfork paleo banjo fam. Raclette woke succulents dreamcatcher, cred gochujang food truck small batch readymade. Lumbersexual occupy pour-over lomo pickled, kale chips succulents biodiesel waistcoat microdosing pop-up whatever. Lyft craft beer plaid DIY. Godard gluten-free keytar mixtape tote bag typewriter. Lo-fi succulents messenger bag, farm-to-table pabst waistcoat lomo. Aesthetic four loko 8-bit cronut semiotics banjo."
// }, function() {
//     console.log("created article!")
// })

//CREATE USER
// var newUser = new Users({
//     email: "chuck@gmail.com",
//     name: "Chuck"
// });


// newUser.save(function(err, data) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });

