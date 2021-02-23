function isAdmin(req, res, next){
    if(req.user && req.user.username === "Admin"){
        next();
    } else{
        res.redirect("/not-found")
    }
};

module.exports = isAdmin;