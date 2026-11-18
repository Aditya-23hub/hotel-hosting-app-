 require("dotenv").config();
 const express=require("express");
 const app=express();
const mongoose=require("mongoose");
///ye session ke liyee hai 
const session=require("express-session");
const{listingSchema,reviewSchema}=require("./schema.js")
const listings=require("./init/routes/listing.js");
const UserRouter=require("./init/routes/user.js");
const flash=require("connect-flash");
// ye rha authentication and authorization ka code 
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
/// url  mongo db serbver se coonect krne ke ,iye code use hoo rhaa hai 

const Mongose_url = process.env.MONGODB_URI;
//  const Mongose_url="mongodb://127.0.0.1:27017/wanderlust";
//   const wrapAsyn = require("./init/utils/wrapAsyn.js");

// main()
// .then(()=>{
//     console.log("connected to DB");

// }).catch((err)=>{
// console.log(err);
// });
// async function main(){
//      await mongoose.connect(Mongose_url); 
// }
// /// mongosh url ka coonerction hai ye 

 const Listing =require("./models/listing.js")
 const Review =require("./models/review.js")
const path=require("path")

/// path koo join kiya jaa rhaa hai 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//////for pari9ng of data 

app.use(express.urlencoded({extended:true}));



// // FOR JOINING THE EJS_MATH PATH 
 const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
/// validation error  ke liye use hoo rha hai 
 const wrapAsyn=require("./init/utils/wrapAsyn.js");

// ye  Express error handling ke liye use hoo rha hai 
 const ExpressError=require("./init/utils/ExpressError.js");
// /////
// const ejsMate = require("ejs-mate");
// app.engine("ejs", ejsMate); 
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// //  <!-- for joining the CSS PATH -->
 app.use(express.static(path.join(__dirname,"/public")))

////// validatidion error 
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

///yee update function ke liyeee kaaamm aeegaa update 
const methodOverride=require("method-override");
app.use(methodOverride("_method"));




//// Asynfuntion for error handling ;
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    };
}
//// error handling 
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("listings/error", { message });
// });

// // new Route 

// app.get("/",(req,res)=>{
//     res.send("hii i m rooot");//' for displaing the data  browser prr 
// })
app.get("/", (req, res) => {
    res.redirect("/listings");
});
// session ka folder 

// const sessionOptions={
//     secret: "mysupersecretstring",
//   resave: false,
//   saveUninitialized: true,
//   cookie:{
//     expire:Date.now()+7*24*60*60*1000,
//     maxAge:7*24*60*60*1000,
//     httpOnly:true,///ye crossscripting attacks ko prevent krne ke liye use hota hai 
//   }
// }
app.set("trust proxy", 1);

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
};
// app.use(express.urlencoded({ extended: true }));
app.use(session(
  sessionOptions
))
app.use(flash());
// ye rhaa authentication and authorization ka code 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


/// demo user ka code 
//   app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });
///Revies
//post Rout 
app.post("/listings/:id/reviews",validateReview,wrapAsyn(async(req,res)=>{
let listing = await Listing.findById(req.params.id);
console.log(req.body); 
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    // res.send("new review saved");
       req.flash("success","NEW Review  ADDED!");
     res.redirect(`/listings/${listing.id}`)
    
}));

// //delete  review 
// Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsyn(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
  req.flash("success"," Review  Deleted!");
    res.redirect(`/listings/${id}`);
  })
);









// // app.get("/testListing",async(req,res)=>{
// //    let sampleListing=new Listing({
// //     title:"my new ville",
// //     description:"By the beach",
// //     price:1200,
// //     location:"Calangute, goa",
// //     country:"India"
// //    })
// //    await sampleListing.save();
// //    console.log("sample was saved ");
// //    res.send("successful testing ");
// // })


app.use("/listings",listings)
app.use("/",UserRouter)
// app.use((err,req,res,next)=>{
//    console.log(err.name);
//    next(err);
// })
// app.use((err,req,res,next)=>{
//     let {status=500,message="Some Error Occurs"}=err;
//     res.status(status).send(message);
// });

// app.all("*",(req,res,next)=>{
//    next(new ExpressError(404,"page not found!"));
// });


/// error handling middle ware 
// app.use((err,req,res,next)=>{
//     let{statusCode,message}=err;
//     res.status(statusCode).send(message);
// });
////////h
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("error.ejs",{message});
//     // res.status(statusCode).send(message);
// });

// app.listen(8080,()=>{
//     // ye terminal me print kreega 
//     console.log("server is listening to the port 8080");
// });
// Handle unknown routes


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Global error handling middleware
app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res.status(statusCode).render("listings/error", {
        message
    });
});
async function startServer() {
    try {

        // Connect to MongoDB Atlas
        await mongoose.connect(Mongose_url);

        console.log("Connected to MongoDB Atlas");

        // Start the server
        const PORT = process.env.PORT || 8080;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {

        console.log("Database connection failed:", err);

        process.exit(1);
    }
}

startServer();


