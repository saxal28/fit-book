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
var Article = require("./models/articles");
var Recipe = require("./models/recipes");
var Comment = require("./models/comments");
var seedDB = require("./seeds");
var app = express();



// seedDB();  seed the database
//local database
// mongoose.connect("mongodb://localhost/fit-book");

//hosted db
mongoose.connect("mongodb://saxal28:gatorade2@ds019846.mlab.com:19846/fit-book");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs");

//pass data to every template
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


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
    res.render("home", {currentUser: req.user});
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

app.get("/articles/all", function(req, res) {
    Article.find({}, function(err, foundArticle) {
        if (err) {
            console.log(err);
        } else {
            res.render("articles/all", {article: foundArticle});
        }
    })
    
})

//==============================
//INDEX ROUTE => BULLETIN BOARD
//==============================

app.get("/bulletin-board", isLoggedIn,  function(req, res) {
    Article.find({}, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            Recipe.find({}, function(err, recipe) {
                if(err) {
                    console.log(err)
                } else {
                    res.render("bulletin-board/index", {article:article, recipe:recipe, currentUser: req.user})
                }
            })
        }
    });
});

//============================
//INDEX ROUTE => HQ
//============================

app.get("/hq", isLoggedIn,  function(req, res) {
    Article.find({}, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            Recipe.find({}, function(err, recipe) {
                if(err) {
                    console.log(err)
                } else {
                        res.render("hq/index", {article:article, recipe:recipe, currentUser: req.user })
                }
            })
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

//============================
//CREATE ROUTE => RECIPES
//============================

app.post("/recipes", function(req, res) {
    Recipe.create(req.body.recipe, function(err, createdRecipe) {
        if(err){
            console.log(err);
        } else {
            //add username and id to recipe
            createdRecipe.author.id = req.user._id;
            createdRecipe.author.username = req.user.username;
            createdRecipe.save();
            //redirect back to /recipes
            console.log("created recipe")
            res.redirect("/bulletin-board");
        }
    });
});

//============================
//CREATE ROUTE > ARTICLES
//============================

app.post("/articles/all", function(req, res) {
    Article.create(req.body.article, function(err, createdArticle) {
        if(err) {
            console.log(err);
        } else {
            createdArticle.author.id = req.user._id;
            createdArticle.author.username = req.user.username;
            createdArticle.save();
            console.log("Created article");
            res.redirect("/bulletin-board");
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
            res.render("show", {recipe: recipe, currentUser: req.user});
        }
    });
});

//============================
//SHOW ROUTE => ARTICLES
//============================

app.get("/articles/all/:id", function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            
            res.render("articles/show", {article: article, currentUser: req.user});
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
});

//=====================================================================
//---------------------COMMENTS ROUTES--------------------------------
//=====================================================================

//article comments

app.get("/articles/all/:id/comments/new", function(req, res) {
    //find campground by id
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
        } else {
             res.render("comments/new", {article:article})
        }
    });
});

app.post("/articles/all/:id/comments", function(req, res) {
    //lookup article by id
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
            res.redirect("/articles/all");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to article
                    article.comments.push(comment);
                    article.save();
                    //redirect back to article
                    console.log(comment)
                    res.redirect("/articles/all/"+req.params.id)
                }
            })
            
        }
    });
});

//recipe comments
//recipe new comment form
app.get("/recipes/:id/comments/new", function(req, res) {
    Recipe.findById(req.params.id, function(err, foundRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/recipe/new", {recipe:foundRecipe});
        }
    });
});

//recipe create new comment
app.post("/recipes/:id/comments", function(req, res) {
    //find recipe
    Recipe.findById(req.params.id, function(err, recipe) {
        if(err) {
            console.log(err);
        } else {
            //add comment to recipe
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to article
                    recipe.comments.push(comment);
                    recipe.save();
                    //redirect back to article
                    console.log(comment)
                    console.log("comment created")
                    res.redirect("/recipes/"+req.params.id)
                }
            })
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
            res.redirect("/hq");
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
    successRedirect: "/hq",
    failureRedirect: "/login"
    }),  function(req, res) {
});

//logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }
}

//=========================
//server listener
//=========================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started! ===>");
});



