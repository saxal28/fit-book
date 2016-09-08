//=======================
//setting up npm packages
//=======================
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express =require("express");
var app = express();


//local database
mongoose.connect("mongodb://localhost/fit-book");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs");

//=======================
// DB SETUP
//=======================

//SCHEMA
var recipeSchema = new mongoose.Schema ({
    title: String,
    image: String,
    summary: String,
    ingredients: String,
    instructions: String,
    calories: String,
    carb: String,
    protein: String,
    fat: String
});

//MODEL
var Recipe = mongoose.model("Recipe", recipeSchema);

// //CREATE RECIPE
// Recipe.create({
//     title: "Protein Pancakes",
//     image: "https://hd.unsplash.com/photo-1462188769884-495d009c7f03",
//     instructions: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//     calories: "800",
//     carb: "60",
//     protein: "45",
//     fat: "3"
// }, function() {
//     console.log("created recipe!");
// });



//=======================
//HOME ROUTE
//=======================

app.get("/", function(req, res) {
    res.render("home");
});

//=====================================================================
//--------------------------INDEX ROUTES-------------------------------
//=====================================================================

//============================
//INDEX ROUTE => RECIPES
//============================

app.get("/recipes", function(req, res) {
    Recipe.find({}, function(err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
             res.render("index", {recipes: foundRecipe});
        }
    })
});

//============================
//INDEX ROUTE => RECIPES/MONTH
//============================

app.get("/recipes-of-the-month", function(req, res) {
    res.render('recipe-of-the-month/index');
});
//============================
//INDEX ROUTE => ARTICLES
//============================

app.get("/articles", function(req, res) {
    res.render("articles/index");
})
app.get("/articles/weightlifting", function(req, res) {
    res.render("articles/weightlifting")
})

app.get("/articles/cardio", function(req, res) {
    res.render("articles/cardio")
})

app.get("/articles/nutrition", function(req, res) {
    res.render("articles/nutrition")
})


//=====================================================================
//--------------------------NEW ROUTES-------------------------------
//=====================================================================

//============================
//NEW ROUTE => RECIPES
//============================
app.get("/recipes/new", function(req, res) {
    res.render("new");
});


//=====================================================================
//-------------------------CREATE ROUTES-------------------------------
//=====================================================================

app.post("/recipes", function(req, res) {
    Recipe.create(req.body.recipe, function(err, createdRecipe) {
        if(err){
            console.log(err);
        } else {
            //redirect back to /recipes
            res.redirect("/recipes");
        }
    });
});


//=====================================================================
//--------------------------SHOW ROUTES-------------------------------
//=====================================================================



//============================
//SHOW ROUTE => RECIPES
//============================

app.get("/recipes/:id", function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if(err){ 
            console.log(err);
        } else {
            res.render("show", {recipe: recipe});
        }
    })
})


//=====================================================================
//--------------------------EDIT ROUTES=-------------------------------
//=====================================================================

//============================
//EDIT ROUTE => RECIPES
//============================

app.get("/recipes/:id/edit", function(req, res) {
    Recipe.findById(req.params.id, function(err, foundRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {recipe: foundRecipe});
        }
    })
})

//=====================================================================
//--------------------------UPDATE ROUTES=-----------------------------
//=====================================================================

//============================
//UPDATE ROUTE => RECIPES
//============================

app.put("/recipes/:id", function(req, res) {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/recipes/"+req.params.id);
        }
    })
})

//=====================================================================
//--------------------------DELETE ROUTES=-----------------------------
//=====================================================================

//============================
//DELETE ROUTE => RECIPES
//============================
app.delete("/recipes/:id", function(req, res) {
    Recipe.findByIdAndRemove(req.params.id, function(err, deletedRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/recipes");
        }
    })
})


//=====================================================================
//--------------------------SIGN-IN & SIGN-UP ROUTES=-----------------
//=====================================================================

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

//=========================
//server listener
//=========================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started! ===>");
});



