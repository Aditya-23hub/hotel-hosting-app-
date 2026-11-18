
const express = require("express");
const app = express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
const { name } = require("ejs");
/// path koo join kiya jaa rhaa hai 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// const users = require("./init/classroom/user.js"); // This looks for a folder named 'init' INSIDE 'classroom'
// const users = require("./user.js");
// const posts = require("./post.js");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser);
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", { signed: true });
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// });




// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.cookie("madein", "kolkata");
//     res.send("sent you some cookies!");
// });

const sessionOptions={
    secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
}
app.use(session(
  sessionOptions
))
app.use(flash());
app.get("/register",(req,res)=>{
    let{name="ananymous"}=req.query;
    req.session.name=name;
req.flash("success","user register successful");
    // console.log(req.session.name);
    // res.send(name);
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name,msg:req.flash("success")})
    //  res.send(`hello,${req.session.name}` );
})

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }

//   res.send(`You sent a request ${req.session.count} times`);
// });
// app.use(session({secret:"aditya"}))
// app.get("/test",(req,res)=>{
//     res.send("test sucessfull");
// })
  app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hi, I am root!");
});
// yee haii users route ko lene ke liye and c  
// app.use("/users",users);
// app.use("/posts",posts);  

app.listen(3000,()=>{
    console.log("server is listening to 3000")
});