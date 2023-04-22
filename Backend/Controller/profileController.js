// Import Express
const express = require('express');
// Import Router
const router = new express.Router();
// Import Multer
const multer = require('multer');
// Import Profile Collection/Model
const Profile = require("../Model/profile");
// Import User Collection/Model
const User = require("../Model/user");
// Import Authentication
const auth = require("../Middleware/auth");

// Create Storage by Multer MemoryStorage
const Storage = multer.memoryStorage({
    // Create the filename for every file
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Store the Image in Multer
const upload = multer({ storage: Storage });

// Upload Image by Id API
router.post('/upload/:id', auth, upload.single('profileImage'), async (req, res) => {
    try {
        // If the user id and params id match
        if (req.user.id === req.params.id) {
            const user_id = req.user.id;
            // Get the details of the profile by user id
            let profile = await Profile.findOne({ user_id: user_id });
            // Get the details of the user by user id
            let username = await User.findOne({ _id: user_id })
            // If the profile is not exists of that user then create it
            if (!profile) {
                // Set the Collection Field with Data
                profile = new Profile({
                    user_id: user_id,
                    username: username.firstname + " " + username.lastname,
                    name: req.file.originalname,
                    image: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype
                    }
                })
            }
            // If the profile is exists of that user then update it
            else {
                profile.name = req.file.originalname;
                profile.username = username.firstname + " " + username.lastname;
                profile.image.data = req.file.buffer;
                profile.image.contentType = req.file.mimetype;
            }

            //  Save the Document in the Profile Collection
            const createProfile = await profile.save();
            //  Set Created Status
            res.set('Content-Type', profile.image.contentType);
            res.status(201).send(createProfile);
        } else {
            // Set Internal Server Error Status
            res.status(500).send("You can only view your own account !!");
        }
    } catch (error) {
        // Set Internal Server Error Status
        res.status(500).send("Server Error !!");
    }

})

// Exports the Router
module.exports = router;