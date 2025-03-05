const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {isAuthenticated} = require("../middleware/jwt.middleware");

const Request = require("../models/Request.model")

// create a request
router.post("/gamelist/:gameId/request", isAuthenticated, (req, res, next) => {
const { gameId } = req.params;
const newRequest = req.body;
Request.create(newRequest)
.then((request) => {
res.status(201).json(request)
})
.catch((err) => {
console.log("error while creating a request", err);
res.status(500).json({message: "error while creating a request"})
})
})

// receive a request
router.get("/gamelist/:gameId/request", isAuthenticated, (req, res, next) => {
    const { gameId } = req.params
    Request.findById(gameId)
    .populate("requestedGame", "offeredGame")
    .then((request) => {
        res.json(request)
    })
    .catch((err) => {
        console.log("error while retrieving a request", err);
        res.status(500).json({message: "error while retrieving a request"})
    })
})

module.exports = router