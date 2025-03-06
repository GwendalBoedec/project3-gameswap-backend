const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Request = require("../models/Request.model")

// create a request
router.post("/gameslist/:gameId/requests", isAuthenticated, (req, res, next) => {
    const { gameId } = req.params;
    const newRequest = req.body;
    Request.create(newRequest)
        .then((request) => {
            res.status(201).json(request)
        })
        .catch((err) => {
            console.log("error while creating a request", err);
            res.status(500).json({ message: "error while creating a request" })
        })
})

// receive all request
router.get("/requests", isAuthenticated, (req, res, next) => {
    //const { gameId } = req.params
    Request.find()
        .populate("requestedGame")
        .populate("offeredGame")
        .then((requests) => {
            res.json(requests)
        })
        .catch((err) => {
            console.log("error while retrieving a request", err);
            res.status(500).json({ message: "error while retrieving a request" })
        })
})

module.exports = router