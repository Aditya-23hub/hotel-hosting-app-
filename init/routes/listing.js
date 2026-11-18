//  const express=require("express");
// /// yee connect krne lke liye 
//  const router = express.Router();
//  /// validation error  ke liye use hoo rha hai 
// //  const wrapAsyn=require("../init/utils/wrapAsyn.js");
// // const wrapAsyn = require("../utils/wrapAsyn.js");
// const wrapAsyn = require("../utils/wrapAsyn.js"); // only if inside init
//  const{listingSchema,reviewSchema}=require("../schema.js");
//  // ye  Express error handling ke liye use hoo rha hai 
// //  const ExpressError=require("../init/utils/ExpressError.js");
// const wrapAsyn = require("../utils/wrapAsyn.js"); 
// const ExpressError = require("../utils/ExpressError.js"); 
// // const ExpressError = require("../utils/ExpressError.js");
// //  const listings=require("../routes/listings.js");

// // const Listing = require("../models/listing.js");
//  ////// validatidion error 
//  const validateListing = (req, res, next) => {
//      let { error } = listingSchema.validate(req.body);
//      if (error) {
//          let errMsg = error.details.map((el) => el.message).join(",");
//          throw new ExpressError(400, errMsg);
//      } else {
//          next();
//      }
//  };
//  ///INDESX route 
// router.get("/", wrapAsyn(async (req, res) => {
//     const all_Listing=await Listing.find({});
//     res.render("listings/index",{all_Listing})

//     // Listing.find({}).then((res)=>{
//     //     console.log(res)   // for printing the listing value in the console 

// //
//    // })
// }))

// //// yeee nyaaa listing addd krnee kee liyee usee huaaa hauuaa 
// router.get("/new",(req,res)=>{
//     /// error handling 
//     //throw new  ExpressError(404,"page not found ");
//     res.render("listings/new")
// })

// // // //Show Route
// router.get("/:id", asyncWrap(async (req,res,next)=>{
//     let {id}=req.params;
//     // console.log(id);
    
//     const listing =await Listing.findById(id).populate("reviews");
//     //Error handling 
//     if(!listing){
//         throw new  ExpressError(404,"listing  not found ");
//     }
//      res.render("listings/show",{listing})

// }))

// // // // Edit Route and upfatre donee eekk sath lkaam krtaa hai 
// router.get("/:id/edit",asyncWrap(async(req,res)=>{
//     let {id}=req.params;
//     const listing =await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }))

// // // Update Route 
// router.put("/:id",asyncWrap(async(req,res)=>{
//     let{id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing})
//     //  throw new  ExpressError(404,"page not found ");
//     res.redirect(`/listings/${id}`)
// }))

// // //delete route

// router.delete("/:id",wrapAsyn(async(req,res)=>{
//     //ERRROE HANDLING  for try and catch block 
//     try{
//         let{id}=req.params;
//      let delete_listing=await Listing.findByIdAndDelete(id);
//     //  console.log(delete_listing);

//     res.redirect(`/listings`)
//     }
//     catch(err){
//         next(err);
//     }
    
// }))
// // // create route yee jbb hmm form submit krtee haii tbb yee listing jaa kr phle wale listing me addd hoo jata hai 

// router .post("/",validateListing,wrapAsyn(async(req,res,next)=>{
// // let listing=req.body;       // print the dta in the terminal
    
//  const newListing =new Listing(req.body.listing);
// await newListing.save();
// res.redirect("/listings")
   
//  console.log(newListing);  
// //   res.send("Form submitted successfully!");
// })
//  );
// module.exports = router;
// /kkkk
const express = require("express");
const router = express.Router();
// ye midele wre hai joo authenication check keta hai 
const {isloggedIn}=require("../../middleware.js");
const wrapAsyn = require("../utils/wrapAsyn.js");
const { listingSchema } = require("../../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};
//// Asynfuntion for error handling ;
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    };
}


// INDEX
router.get("/", wrapAsyn(async (req, res) => {
    const all_Listing = await Listing.find({});
    res.render("listings/index", { all_Listing });
}));

// NEW
router.get("/new", isloggedIn,(req, res) => {
    // ye check krta hai kii log login kiye haii kii nhii 
   
    res.render("listings/new");

});

// SHOW
router.get("/:id", wrapAsyn(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    if (!listing) {
          req.flash("error","listing your request for does not exists");
          res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show", { listing });
}));

// EDIT
router.get("/:id/edit",isloggedIn, wrapAsyn(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
          req.flash("error","listing your request for does not exists");
          res.redirect("/listings")
    }
    res.render("listings/edit", { listing });
}));

// UPDATE
router.put("/:id",isloggedIn, wrapAsyn(async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
      req.flash("success","NEW Updated  ADDED!");
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id",isloggedIn,wrapAsyn(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
     req.flash("success"," LISTING deleted!");
    res.redirect("/listings");
}));

// CREATE
router.post("/", isloggedIn,validateListing, wrapAsyn(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","NEW LISTING ADDED!");
    res.redirect("/listings");
}));

module.exports = router;