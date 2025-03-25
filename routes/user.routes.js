const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const User = require("../models/User.model.js")

// get the list of users except the one connected
router.get("/users", isAuthenticated, (req, res, next) => {
    const userId = req.payload._id;
    User.find({_id: { $ne: userId} })
       .populate("ownedGames")
       .then((allUsers) => {
        res.status(200).json(allUsers)
       }) 
       .catch((err) => {
        console.log("Error while retrieving user list", err);
        res.status(500).json({message: "error while retrieving user list"})
       })
})

module.exports = router