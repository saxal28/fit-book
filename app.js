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
var Question = require("./models/questions");
var Motivation = require("./models/motivation");
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

app.get("/bulletin-board/recipes", function(req, res) {
    Recipe.find({}, function(err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
             res.render("index", {recipes: foundRecipe, currentUser: req.user});
        }
    })
});

//============================
//INDEX ROUTE => ARTICLES
//============================

app.get("/bulletin-board/articles", function(req, res) {
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
                   Question.find({}, function(err, question) {
                       if(err) {
                           console.log(err);
                       } else {
                           Motivation.find({}, function(err, motivation) {
                               if(err) {
                                   console.log(err)
                               } else {
                                    res.render("bulletin-board/index", {article:article, recipe:recipe, currentUser: req.user, question:question, motivation:motivation})
                               }
                           })
                       }
                   })
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
                    Question.find({}, function(err, question) {
                        if(err) {
                            console.log(err);
                        } else {
                            Motivation.find({}, function(err, motivation) {
                                if(err) {
                                    console.log(err)
                                } else {
                                    res.render("hq/index", {article:article, recipe:recipe, currentUser: req.user, question:question, motivation:motivation })
                                }
                            })
                        }
                    })
                        
                }
            })
        }
    })
})

//============================
//INDEX ROUTE => QUESTIONS
//============================

app.get("/bulletin-board/questions", function(req, res) {
   Question.find({}, function(err, question) {
       if(err) {
           console.log(err);
       } else {
           res.render("questions/index", {currentUser: req.user, question:question})
       }
   })
})

//============================
//INDEX ROUTE => MOTIVATION
//============================

app.get("/bulletin-board/motivation", function(req, res) {
    Motivation.find({}, function(err, motivation) {
        if(err) {
            console.log(err)
        } else {
                res.render("motivation/index", {currentUser: req.user, motivation:motivation});
        }
    })
});

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
app.get("/bulletin-board/recipes/new", function(req, res) {
    res.render("new");
});

//============================
//NEW ROUTE = > ARTICLES
//============================
app.get("/bulletin-board/articles/new", function(req, res) {
    res.render("articles/new")
});

//============================
//NEW ROUTE = > QUESTIONS 
//============================

app.get("/bulletin-board/questions/new", function(req, res) {
    res.render("questions/new");
});

//============================
//NEW ROUTE = > MOTIVATION
//============================
 app.get("/bulletin-board/motivation/new", function(req, res) {
     res.render("motivation/new");
 });


//=====================================================================
//-------------------------CREATE ROUTES-------------------------------
//=====================================================================

//============================
//CREATE ROUTE => RECIPES
//============================

app.post("/bulletin-board/recipes", function(req, res) {
    Recipe.create(req.body.recipe, function(err, createdRecipe) {
        if(err){
            console.log(err);
        } else {
            //add username and id to recipe
            createdRecipe.author.id = req.user._id;
            createdRecipe.author.username = req.user.username;
            createdRecipe.save();
            //redirect back to /bulletin-board/recipes
            console.log("created recipe")
            res.redirect("/bulletin-board");
        }
    });
});

//============================
//CREATE ROUTE > ARTICLES
//============================

app.post("/bulletin-board/articles", function(req, res) {
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

//============================
//CREATE ROUTE => QUESTIONS
//============================

app.post("/bulletin-board/questions", function(req, res) {
    Question.create(req.body.question, function(err, createdQuestion) {
        if(err) {
            console.log(err)
        } else {
            createdQuestion.author.id = req.user._id;
            createdQuestion.author.username = req.user.username;
            createdQuestion.save();
            console.log("asked question");
            res.redirect("/bulletin-board")
        }
    })
})

//============================
//CREATE ROUTE => MOTIVATION
//============================

app.post("/bulletin-board/motivation", function(req, res) {
    Motivation.create(req.body.motivation, function(err, motivation) {
        if(err) {
            console.log(err);
        } else {
            motivation.author.id = req.user._id;
            motivation.author.username = req.user.username;
            motivation.save();
            console.log("added motivation");
            res.redirect("/bulletin-board");
        }
    })
})


//=====================================================================
//--------------------------SHOW ROUTES-------------------------------
//=====================================================================



//============================
//SHOW ROUTE => RECIPES
//============================

app.get("/bulletin-board/recipes/:id", function(req, res) {
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

app.get("/bulletin-board/articles/:id", function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            
            res.render("articles/show", {article: article, currentUser: req.user});
        }
    });
});

//============================
//SHOW ROUTE => Questions
//============================
    app.get("/bulletin-board/questions/:id", function(req, res) {
        Question.findById(req.params.id, function(err, question) {
            if(err) {
                console.log(err);
            } else {
                res.render("questions/show", {question: question, currentUser: req.user});
            }
        });
    });
    
//============================
//SHOW ROUTE => MOTIVATION
//============================
    app.get("/bulletin-board/motivation/:id", function(req, res) {
        Motivation.findById(req.params.id, function(err, motivation) {
            if(err) {
                console.log(err);
            } else {
                res.render("motivation/show", {motivation: motivation, currentUser:req.user});
            }
        });
    });


//=====================================================================
//--------------------------EDIT ROUTES=-------------------------------
//=====================================================================

//============================
//EDIT ROUTE => RECIPES
//============================

app.get("/bulletin-board/recipes/:id/edit", function(req, res) {
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

app.get("/bulletin-board/articles/:id/edit", function(req, res) {
    Article.findById(req.params.id, function(err, foundArticle) {
        if(err) {
            console.log(err)
        } else {
            res.render("articles/edit", {article:foundArticle})
        }
    })
   
})

//============================
//EDIT ROUTE => QUESTION
//============================

app.get("/bulletin-board/questions/:id/edit", function(req, res) {
    Question.findById(req.params.id, function(err, question) {
        if(err) {
            console.log(err);
        } else {
            res.render("questions/edit", {question:question});
        }
    });
});

//============================
//EDIT ROUTE => MOTIVATION
//============================

app.get("/bulletin-board/motivation/:id/edit", function(req, res) {
    Motivation.findById(req.params.id, function(err, motivation) {
        if(err) {
            console.log(err);
        } else {
            res.render("motivation/edit", {motivation:motivation});
        }
    });
});

//=====================================================================
//--------------------------UPDATE ROUTES=-----------------------------
//=====================================================================

//============================
//UPDATE ROUTE => RECIPES
//============================

app.put("/bulletin-board/recipes/:id", function(req, res) {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/bulletin-board/recipes/"+req.params.id);
        }
    })
})

//===========================
//UPDATE ROUTE => ARTICLES
//===========================

app.put("/bulletin-board/articles/:id", function(req, res) {
    Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticle) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/bulletin-board/articles")
        }
    })
})


//===========================
//UPDATE ROUTE => QUESTIONS
//===========================

app.put("/bulletin-board/questions/:id", function(req, res) {
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, question) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/bulletin-board/questions");
        }
    })
})

//=========================
//UPDATE ROUTE => MOTIVATION
//=========================

app.put("/bulletin-board/motivation/:id", function(req, res) {
    Motivation.findByIdAndUpdate(req.params.id, req.body.motivation, function(err, motivation) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/bulletin-board/motivation");
        }
    })
})

//=====================================================================
//--------------------------DELETE ROUTES=-----------------------------
//=====================================================================

//============================
//DELETE ROUTE => RECIPES
//============================
app.delete("/bulletin-board/recipes/:id", function(req, res) {
    Recipe.findByIdAndRemove(req.params.id, function(err, deletedRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("back");
        }
    })
})

//============================
//DELETE ROUTE => ARTICLES
//============================

app.delete("/bulletin-board/articles/:id", function(req, res) {
    Article.findByIdAndRemove(req.params.id, function(err, deleted) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("back")
        }
    })
});

//============================
// DELETE ROUTE => QUESTIONS
//============================

    app.delete("/bulletin-board/questions/:id", function(req, res) {
        Question.findByIdAndRemove(req.params.id, function(err, deleted) {
            if(err) {
                console.log(err)
            } else {
                res.redirect("back")
            }
        })
    })
    
//===========================
// DELETE ROUTE => MOTIVATION
//===========================

app.delete("/bulletin-board/motivation/:id", function(req, res) {
    Motivation.findByIdAndRemove(req.params.id, function(err, deleted) {
        if(err){
            console.log(err)
        } else {
            res.redirect("back");
        }
    })
})

//=====================================================================
//---------------------COMMENTS ROUTES--------------------------------
//=====================================================================


//===========================
//COMMENTS => ARTICLE
//==========================

//article comments

app.get("/bulletin-board/articles/:id/comments/new", function(req, res) {
    //find campground by id
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
        } else {
             res.render("comments/new", {article:article})
        }
    });
});

app.post("/bulletin-board/articles/:id/comments", function(req, res) {
    //lookup article by id
    Article.findById(req.params.id, function(err, article) {
        if(err) {
            console.log(err);
            res.redirect("/bulletin-board/articles");
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
                    res.redirect("/bulletin-board/articles/"+req.params.id)
                }
            })
            
        }
    });
});

//===========================
// COMMENTS => RECIPE
//==========================

//recipe comments
//recipe new comment form
app.get("/bulletin-board/recipes/:id/comments/new", function(req, res) {
    Recipe.findById(req.params.id, function(err, foundRecipe) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/recipe/new", {recipe:foundRecipe});
        }
    });
});

//recipe create new comment
app.post("/bulletin-board/recipes/:id/comments", function(req, res) {
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
                    res.redirect("/bulletin-board/recipes/"+req.params.id)
                }
            })
        }
    })
    
})

//===========================
// COMMENTS => QUESTIONS
//==========================

// NEW QUESTION COMMENT FORM
app.get("/bulletin-board/questions/:id/comments/new", function(req, res) {
    //find question
    Question.findById(req.params.id, function(err, question) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/questions/new", {question: question})
        }
    })
})

// CREATE NEW QUESTION COMMENT
app.post("/bulletin-board/questions/:id/comments", function(req, res) {
    //find question
    Question.findById(req.params.id, function(err, question) {
        if(err) {
            console.log(err);
        } else {
            //create comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                } else{
                    // add author username and id to comment and save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //push comment to question
                    question.comments.push(comment);
                    question.save();
                    console.log(comment)
                    console.log("Created comment")
                    //redirect back to question
                    res.redirect("/bulletin-board/questions/"+req.params.id)
                }
            })
        }
    })
    //add comment to question
})


//===========================
// COMMENTS => MOTIVATION
//==========================

// NEW MOTIVATION COMMENT FORM
app.get("/bulletin-board/motivation/:id/comments/new", function(req, res) {
    //find question
    Motivation.findById(req.params.id, function(err, motivation) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/motivation/new", {motivation: motivation});
        }
    });
});

// CREATE NEW MOTIVAITON COMMENT
app.post("/bulletin-board/motivation/:id/comments", function(req, res) {
    //find question
    Motivation.findById(req.params.id, function(err, motivation) {
        if(err) {
            console.log(err);
        } else {
            //create comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                } else{
                    // add author username and id to comment and save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //push comment to question
                    motivation.comments.push(comment);
                    motivation.save();
                    console.log(comment)
                    console.log("Created comment")
                    //redirect back to question
                    res.redirect("/bulletin-board/motivation/"+req.params.id)
                }
            })
        }
    })
    //add comment to question
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

//testing
//finding things in database and updating

//added type 

// Question.find({}, function(err, recipes) {
//     if(err){
//         console.log(err)
//     } else {
//         recipes.forEach(function(item) {
//             item.type = "question",
//             item.save();
//             console.log(item)
//             console.log("recipe updated");
//         })
//     }
// })



