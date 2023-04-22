// Import dotenv
require('dotenv').config({ path: './.env' });

// Import Express
const express = require('express');
// Import CORS
const cors = require('cors');
// Connect Database
require("./Database/db");

// Create App
const app = express();

// Get the Port
const port = process.env.PORT || 5000;

// Use JSON
app.use(express.json());
// Use CORS
app.use(cors());

// Import User Router
app.use("/api/users", require("./Controller/userController"));
// Import Profile Router
app.use("/api/profiles", require("./Controller/profileController"));
// Import CountryCode Router
app.use("/api/codes/", require("./Controller/countryCodeController"));

app.all("*", (req, res) => {
    res.status(404).send("`~` Page Not Found `~`");
})

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}/`);
})