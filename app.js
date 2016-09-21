//=======================
//setting up npm packages
//=======================
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express =require("express");
var passport = require('passport');
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var app = express();


//local database
// mongoose.connect("mongodb://localhost/fit-book");

//hosted db
mongoose.connect("mongodb://saxal28:gatorade2@ds019846.mlab.com:19846/fit-book");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs");

//=======================
// DB SETUP
//=======================

//SCHEMAS
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

var articleSchema = new mongoose.Schema({
    title: String,
    image: String,
    flag: String,
    summary: String,
    body: String
})

//MODELS
var Recipe = mongoose.model("Recipe", recipeSchema);
var Article = mongoose.model("Article", articleSchema);

// //CREATE RECIPE && CREATE ARTICLE
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

// Article.create({
//     title: "Article Example",
//     image: "http://images.wisegeek.com/barbell-with-weights.jpg",
//     flag: "Weightlifting",
//     summary: "An article about weightlifting",
//     body: "Succulents gentrify small batch poutine chicharrones intelligentsia, cornhole pork belly butcher pitchfork paleo banjo fam. Raclette woke succulents dreamcatcher, cred gochujang food truck small batch readymade. Lumbersexual occupy pour-over lomo pickled, kale chips succulents biodiesel waistcoat microdosing pop-up whatever. Lyft craft beer plaid DIY. Godard gluten-free keytar mixtape tote bag typewriter. Lo-fi succulents messenger bag, farm-to-table pabst waistcoat lomo. Aesthetic four loko 8-bit cronut semiotics banjo."
// }, function() {
//     console.log("created article!")
// })

// passport configuration
app.use(require("express-session") ({
    secret: "Alan is cool",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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

app.get("/articles/all", function(req, res) {
    Article.find({}, function(err, foundArticle) {
        if (err) {
            console.log(err);
        } else {
            res.render("articles/all", {article: foundArticle});
        }
    })
    
})

//============================
//INDEX ROUTE => DANGER ZONE
//============================

app.get("/danger-zone", function(req, res) {
    res.render("articles/construction-zone");
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

//============================
//NEW ROUTE = > ARTICLES
//============================
app.get("/articles/all/new", function(req, res) {
    res.render("articles/new")
})


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

app.post("/articles/all", function(req, res) {
    Article.create(req.body.article, function(err, createdArticle) {
        if(err) {
            console.log(err);
        } else {
            console.log("Created article");
            res.redirect("/articles/all");
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
    });
});

app.get("/articles/all/:id", function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            res.render("articles/show", {article: article});
        }
    });
});


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

//============================
//EDIT ROUTE => ARTICLES
//============================

app.get("/articles/all/:id/edit", function(req, res) {
    Article.findById(req.params.id, function(err, foundArticle) {
        if(err) {
            console.log(err)
        } else {
            res.render("articles/edit", {article:foundArticle})
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

//===========================
//UPDATE ROUTE => ARTICLES
//===========================

app.put("/articles/all/:id", function(req, res) {
    Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticle) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/articles/all")
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

//============================
//DELETE ROUTE => ARTICLES
//============================

app.delete("/articles/all/:id", function(req, res) {
    Article.findByIdAndRemove(req.params.id, function(err, deleted) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/articles/all")
        }
    })
})

//=====================================================================
//--------------------------AUTH ROUTES=------------------------------
//=====================================================================

//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handle signup logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function() {
            res.redirect("/recipes");
        });
    });
});

//show login form
app.get("/login", function(req, res) {
    res.render("login");
});

//login logic
app.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/recipes",
    failureRedirect: "/login"
    }),  function(req, res) {
})

//logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

//=========================
//server listener
//=========================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started! ===>");
});



