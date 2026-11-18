 module.exports.isloggedIn=(req,res,next)=>{
    //  console.log(req.path,"..",req.originalUrl);
    // console.log(req);


if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must login to create listing ");
        return res.redirect("/login")
    }
    next();
 }
 module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};