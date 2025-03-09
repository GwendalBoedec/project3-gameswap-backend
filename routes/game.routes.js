const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const Game = require("../models/Game.model");

// get the full list of games
router.get("/gameslist", (req, res, next) => {
    Game.find()
       .then((allGames) => {
        res.status(200).json(allGames)
       }) 
       .catch((err) => {
        console.log("Error while retrieving game list", err);
        res.status(500).json({message: "error while retrieving full list of games"})
       })
})
// get a specific game by ID
router.get("/gameslist/:gameId", (req, res, next) => {
    const {gameId} = req.params

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }

    Game.findById(gameId)
      .populate("owner")
       .then((game) => {
        res.status(200).json(game)
       }) 
       .catch((err) => {
        console.log("Error while retrieving the game", err);
        res.status(500).json({message: `error while retrieving game ${gameId}`})
       })
})
// create a game
router.post("/gameslist", (req, res, next) => {
    const newGame = req.body;
    console.log(req.body);
    Game.create(newGame)
    .then((gameFromDB) => {
        res.status(201).json(gameFromDB)
    })
    .catch((err) => {
        console.log("error while creating a game", err);
        res.status(500).json({message: "error while creating a game"})
    })
})
// update a game 
router.put("/gameslist/:gameId", isAuthenticated, (req, res, next) => {
    const {gameId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }

    Game.findByIdAndUpdate(gameId, req.body, { new: true, runValidators: true })
    .then((updatedGame) => {
        res.status(200).json(updatedGame)
    })
    .catch((err) => {
        console.log("error while updating a game", err);
        res.status(500).json({message: "error while updating a game"})
    })
})
// delete a game
router.delete("/gameslist/:gameId", isAuthenticated, (req, res, next) => {
    const {gameId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }
    Game.findByIdAndDelete(gameId)
    .then(() => {
        res.json(`game ${gameId} has been successfully deleted`)
    })
    .catch((err) => {
        console.log("error while deleting a game", err);
        res.status(500).json({message: "error while creating a game"})
    })
})


module.exports = router;