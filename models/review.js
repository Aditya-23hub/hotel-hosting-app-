const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//// schema for review operation 
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()/// agr date naa de tbb datee dee deta hai
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",

    }
});
//export ke liye use ho  rhaa hai
module.exports = mongoose.model("Reviews", reviewSchema);