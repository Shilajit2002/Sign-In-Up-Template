// Import Mongoose
const mongoose = require('mongoose');
// Import Validator
const validator = require('validator');

// Create User Schema
const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email ID !!");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    country:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    about:{
        type:String
    },
    address:{
        type:String
    }
})

// Crate User Collection
const User=mongoose.model("users",userSchema);

// Exports User Module
module.exports=User;