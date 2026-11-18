const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// Note: Using userSchema.plugin is the standard way to integrate passport-local-mongoose and ye hmare liye pasword and salting sb kr ke de deta hai 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);