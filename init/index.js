const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");// go up one level, then into models

const Mongose_url="mongodb://127.0.0.1:27017/wanderlust";

// const toggleBtn = document.getElementById("theme-toggle");
//   toggleBtn.addEventListener("click", () => {
//     document.body.classList.toggle("dark-mode");

//     if (document.body.classList.contains("dark-mode")) {
//       toggleBtn.textContent = "☀️ Light Mode";
//     } else {
//       toggleBtn.textContent = "🌙 Dark Mode";
//     }
//   });

main()
.then(()=>{
    console.log("connected to DB");

})
.catch((err)=>{
console.log(err);
})
async function main(){
    await mongoose.connect(Mongose_url); 
}

const initDB=async()=>{
    await Listing.deleteMany({});  // for deleting the initial data
    initData.data=initData.data.map((obj)=>({...obj,owner:"69dd2b583983c2d5554f3a7e"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};
initDB();