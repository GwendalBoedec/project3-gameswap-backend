
// EN COURS DE CONSTRUCTION

const Game = require("../models/Game.model");

function getGameOwner(req, res) {
    const {gameId} = req.params
    
    Game.findById(gameId)
    .then((game) => {
       const gameOwner = res.json(game.owner);
       const currentUser = req.payload
    })
    .catch((err) => {
        console.log("error while getting game ID", err);
        res.status(500).json({message: "error while getting game ID"})
    })



}

