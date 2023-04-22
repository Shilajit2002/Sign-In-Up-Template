// Import Mongoose
const mongoose = require('mongoose');
// Import Validator
const validator = require('validator');

// Create Profile Schema
const profileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: {
        type: String
    },
    name: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String,
    },
})

// Crate Profile Collection
const Profile = mongoose.model("profiles", profileSchema);

// Exports Profile Module
module.exports = Profile;