// Import Mongoose
const mongoose = require('mongoose');

// Create CountryCode Schema
const countrycodeSchema = mongoose.Schema({
    country: {
        type: String
    },
    code: {
        type: String
    },
    iso: {
        type: String
    }
})

// Create CountryCode Collection
const CountryCode = mongoose.model("countrycodes", countrycodeSchema);

// Exports CountryCode Module
module.exports = CountryCode;