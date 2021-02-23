const express            = require("express"),
      router             = express.Router(),
      passport           = require("passport"),
      User               = require("./models/user"),
      Post               = require("./models/post"),
      isAdmin            = require("./middlewares/isAdmin"),
      isNotLoggedIn      = require("./middlewares/isNotLoggedIn"),
      upload             = require("./middlewares/upload"),
      { celebrate, Joi } = require("celebrate"),
      fs                 = require("fs");

// homepage
router.get("/", (req, res) =>{
    let path = req.route.path;
    res.render("home", {
        user: req.user,
        path
    });
});

// new
router.get("/new", isAdmin, (req, res) =>{
    let path = req.route.path;
    res.render("new", {
        user: req.user,
        path
    });
});

// create
router.post("/index", isAdmin, upload.single("image"),
    celebrate({
        body: Joi.object().keys({
            title: Joi.string().max(100).trim().required(),
            shortDesc: Joi.string().max(200).trim().required(),
            techs: Joi.string().max(100).trim().required(),
            body: Joi.string().max(5000).trim().required(),
            url: Joi.string().uri().trim().required(),
        }),
    }),
    (req, res) =>{
        let fullPost = {
            title: req.body.title,
            shortDesc: req.body.shortDesc,
            techs: req.body.techs,
            body: req.body.body,
            url: req.body.url,
            image: req.file.path
        }
        Post.create(fullPost, (err, post) =>{ 
            if(err){
                fs.unlinkSync(req.file.path);
                res.redirect("/new")   
            } else{
                res.redirect("/profile");
            }
        })
    }
);

// edit
router.get("/edit/:id", isAdmin, (req, res) =>{
    let path = req.route.path;
    Post.findById(req.params.id, (err, post) =>{
        res.render("edit", {
            user: req.user, 
            post,
            path
        })
    })
});

// update
router.put("/edit/:id", isAdmin, upload.single("image"),
    celebrate({
        body: Joi.object().keys({
            title: Joi.string().max(100).trim().required(),
            shortDesc: Joi.string().max(200).trim().required(),
            techs: Joi.string().max(100).trim().required(),
            body: Joi.string().max(5000).trim().required(),
            url: Joi.string().uri().trim().required(),
        }),
    }),
    (req, res) =>{
        let editedPost = {
            title: req.body.title,
            shortDesc: req.body.shortDesc,
            techs: req.body.techs,
            body: req.body.body,
            url: req.body.url
        }
        Post.findByIdAndUpdate(req.params.id, editedPost, (err, modified) =>{
            if(req.file !== undefined){
                fs.unlinkSync(modified.image);
                Post.findByIdAndUpdate(req.params.id, {image: req.file.path}, (err, modifiedImage) =>{
                    res.redirect("/profile")
                }) 
            }else{
                res.redirect("/profile");
            }
        })
    }
);

// delete
router.get("/delete/:id", isAdmin, (req, res) =>{
    let path = req.route.path;
    Post.findById(req.params.id, (err, post) =>{
        res.render("delete", {
            user: req.user,
            post,
            path
        })
    })
});

router.delete("/delete/:id", isAdmin, (req, res) =>{
    Post.findByIdAndRemove(req.params.id, (err, post) =>{
        if(err){
            res.redirect("/not-found");
        } else{
            fs.unlinkSync(post.image);
            res.redirect("/profile");
        }
    });
});

//signup
router.get("/signup", isNotLoggedIn, (req, res) =>{
    let path = req.route.path;
    res.render("signup", {
        user: req.user,
        path
    });
});

router.post("/signup", isNotLoggedIn,
    celebrate({
        body: Joi.object().keys({
            username: Joi.string().min(3).max(30).trim().required(),
            email: Joi.string().email().lowercase().trim().required(),
            password: Joi.string().min(8).max(256).trim().required(),
            password2: Joi.string().min(8).max(256).trim().required()
        }),
    }),
    (req, res) =>{
        if(req.body.password !== req.body.password2) {
            res.redirect("/signup");
        } else {
        User.register(new User({ username : req.body.username }), req.body.password, (err, newUser) =>{
            if (err) {
                res.redirect("/signup");
            } else {
                User.findOne({ username:req.body.username }, (err, foundUser) =>{
                    if (err) {
                        res.redirect("/signup");
                    } else {
                        foundUser.email = req.body.email;
                        foundUser.save();
                    }
                })
                    passport.authenticate("local")(req, res, () =>{
                        res.redirect("/profile");
                    })
            };
        })};
    }
);

//login
router.get("/login", isNotLoggedIn, (req, res) =>{
    let path = req.route.path;
    res.render("login", {
        user: req.user,
        path
    });
});

router.post("/login", isNotLoggedIn,
    celebrate({
        body: Joi.object().keys({
            username: Joi.string().min(3).max(30).trim().required(),
            password: Joi.string().min(8).max(256).trim().required(),
        }),
    }),
    passport.authenticate("local", {failureRedirect: "/not-found"}),
    (req, res) =>{
        res.redirect("/profile");
});

//profile
router.get("/profile", isAdmin, (req, res) =>{
    let path = req.route.path;
    Post.find({}, (err, posts) =>{
        if(!err && req.user){
            res.render("profile", {
                user:req.user, 
                posts,
                path
            });
        }
        else{
            res.redirect("/not-found")
        }
    })
});

router.post("/profile", isAdmin, 
    celebrate({
        body: Joi.object().keys({
            password: Joi.string().min(8).max(256).trim().required(),
            password2: Joi.string().min(8).max(256).trim().required(),
        }),
    }),
    (req, res) => {
        if(req.body.password !== req.body.password2) {
            res.redirect("/not-found");
        } else {
            User.findOne({username: req.user.username}).then(user => {
                if (user){
                    user.setPassword(req.body.password, err => {
                        user.save();
                        res.redirect("/profile");
                    });
                } else {
                    res.redirect("/not-found");
                }
                })
                .catch(err => {
                    res.redirect("/not-found");
                })
        }
    }
);

router.get("/hide-posts", isAdmin, (req, res) =>{
    let change = req.query.change;
    let postId = req.query.id;
    Post.findByIdAndUpdate(postId, {hidden : change}).exec((err, post) =>{})
});

// logout
router.get("/logout", isAdmin, (req, res) =>{
    req.logout();
    res.redirect("/");
});

// 404
router.get("*", (req, res) =>{
    res.render("404")
});

module.exports = router;