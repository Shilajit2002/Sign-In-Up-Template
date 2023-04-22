// Import Express
const express = require('express');
// Import Router
const router = new express.Router();
// Import Country Code Collection/Model
const CountryCode = require("../Model/countrycode");

// API for Get User & Profile Details by ID
router.get("/allcountrycode", async (req, res) => {
    try {
        const response = await CountryCode.find();

        // Set Ok Status
        res.status(200).json(response);
    } catch (error) {
        // Set Internal Server Error Status
        res.status(500).send("Server Error !!");
    }
})

// Exports the Router
module.exports = router;