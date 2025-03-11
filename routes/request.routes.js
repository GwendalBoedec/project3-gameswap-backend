const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Request = require("../models/Request.model")

// create a request
router.post("/gameslist/:gameId/requests", (req, res, next) => {
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
router.get("/requests", (req, res, next) => {
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



// delete a request
router.delete("/requests/:requestId", (req, res, next) => {
    const {requestId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }
    Request.findByIdAndDelete(requestId)
    .then(() => {
        res.json(`request ${requestId} has been successfully deleted`)
    })
    .catch((err) => {
        console.log("error while deleting a game", err);
        res.status(500).json({message: "error while creating a game"})
    })
})

module.exports = router