const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Request = require("../models/Request.model")

// create a request
router.post("/gameslist/:gameId/requests", isAuthenticated, (req, res, next) => {
    const userId = req.payload._id;
    const newRequest = {...req.body, createdBy: userId}
    const { gameId } = req.params;


    if (gameId === userId) {
        return res.status(403).json({ message: "Vous ne pouvez pas échanger votre propre jeu." });
      }
    Request.create(newRequest)
        .then((request) => {
            res.status(201).json(request)
        })
        .catch((err) => {
            console.log("error while creating a request", err);
            res.status(500).json({ message: "error while creating a request" })
        })
})


router.get("/myprofile/sentRequests", isAuthenticated, (req, res, next) => {
    
    const userId = req.payload._id;
    console.log("userID", userId)
    Request.find({createdBy : userId})
    .populate("createdBy")
    .populate("requestedGame")
    .populate("offeredGame")
       .then((sentRequests) => {
        console.log(sentRequests)
        res.status(200).json(sentRequests)
       }) 
       .catch((err) => {
        console.log("Error while retrieving sent requests", err);
        res.status(500).json({message: "Error while retrieving sent requests"})
       })
})

// get requests user has received

router.get("/myprofile/receivedRequests", isAuthenticated, (req, res, next) => {
    
    const userId = req.payload._id;
    console.log("userID", userId)
    Request.find()
    .populate("createdBy")
    .populate("requestedGame")
    .populate("offeredGame")
       .then((requests) => {
        res.status(200).json(
            requests.filter((request)=> 
                request.requestedGame && request.requestedGame.owner.toString() === userId
            )
        )
       }) 
       .catch((err) => {
        console.log("Error while retrieving sent requests", err);
        res.status(500).json({message: "Error while retrieving sent requests"})
       })
})

// delete a request
router.delete("/requests/:requestId", isAuthenticated, (req, res, next) => {
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