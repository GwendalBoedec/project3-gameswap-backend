const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const Game = require("../models/Game.model");
const User = require("../models/User.model.js")

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
// get games the user owns
router.get("/myprofile/games", isAuthenticated, (req, res, next) => {
    
    const userId = req.payload._id;
    console.log(req.payload._id)
    Game.find({owner : userId})
       .then((filteredGames) => {
        res.status(200).json(filteredGames)
       }) 
       .catch((err) => {
        console.log("Error while retrieving personalized game list", err);
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
router.post("/gameslist", isAuthenticated, (req, res, next) => {
    const userId = req.payload._id;
    const newGame = {...req.body, owner: userId}
    
    console.log(req.body);
    Game.create(newGame)
    .then((gameFromDB) => {
       
        return User.findByIdAndUpdate(
            userId, 
            { $push: { ownedGames: gameFromDB._id } }, // add ID on the ownedGames field
            { new: true } // update
        )
    .then((updatedUser) => {
        res.status(201).json({user: updatedUser, game: gameFromDB});
    })

})

    .catch((err) => {
        console.log("error while creating a game", err);
        res.status(500).json({message: "error while creating a game"})
    })
})



router.put("/gameslist/:gameId", (req, res, next) => {
    const { gameId } = req.params;
    const { owner } = req.body;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        return res.status(400).json({ message: "Specified id is not valid" });
    }

    Game.findByIdAndUpdate(gameId, req.body, { new: true, runValidators: true })
        .then((updatedGame) => {
            // Si un nouveau propriétaire est défini, mettre à jour les utilisateurs
            if (owner && updatedGame.owner !== owner) {
                // Retirer le jeu de l'owner précédent
                return Promise.all([
                    User.findOneAndUpdate(
                        { _id: updatedGame.owner },
                        { $pull: { ownedGames: gameId } }, // Retirer l'ID du jeu
                        { new: true }
                    ),
                    // Ajouter le jeu au nouvel owner
                    User.findOneAndUpdate(
                        { _id: owner },
                        { $addToSet: { ownedGames: gameId } }, // Ajouter l'ID du jeu
                        { new: true }
                    )
                ])
                    .then(([previousOwner, newOwner]) => {
                        res.status(200).json(updatedGame); // Tout s'est bien passé, renvoyer le jeu mis à jour
                    })
                    .catch((err) => {
                        console.error("Error updating user's ownedGames", err);
                        res.status(500).json({ message: "Error updating user's ownedGames" });
                    });
            } else {
                // Si pas de changement de propriétaire, renvoyer simplement le jeu mis à jour
                res.status(200).json(updatedGame);
            }
        })
        .catch((err) => {
            console.error("Error while updating a game", err);
            res.status(500).json({ message: "Error while updating a game" });
        });
});
// update a game 
/* router.put("/gameslist/:gameId", (req, res, next) => {
    const {gameId} = req.params;
    const {owner} = req.body;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }

   /*  Game.findByIdAndUpdate(gameId, req.body, { new: true, runValidators: true })
    .then((updatedGame) => {
        res.status(200).json(updatedGame)
    })
    .catch((err) => {
        console.log("error while updating a game", err);
        res.status(500).json({message: "error while updating a game"})
    }) */
     /*   Game.findByIdAndUpdate(gameId, req.body, { new: true, runValidators: true })
        .then((updatedGame) => {
            if (owner) {
                // Si un nouveau propriétaire est défini, on met à jour les utilisateurs
                Promise.all([
                    // Retirer le jeu de l'owner précédent
                    User.findOneAndUpdate(
                        { _id: updatedGame.owner },
                        { $pull: { ownedGames: gameId } },
                        { new: true }
                    ),
                    // Ajouter le jeu au nouvel owner
                    User.findOneAndUpdate(
                        { _id: owner },
                        { $addToSet: { ownedGames: gameId } },
                        { new: true }
                    )
                ])
                    .then(() => {
                        res.status(200).json(updatedGame);
                    })
                    .catch((err) => {
                        console.log("Error updating user's ownedGames", err);
                        res.status(500).json({ message: "Error updating user's ownedGames" });
                    });
            } else {
                // Si pas de changement de propriétaire, on renvoie simplement le jeu mis à jour
                res.status(200).json(updatedGame);
            }
        })
        .catch((err) => {
            console.log("Error while updating a game", err);
            res.status(500).json({ message: "Error while updating a game" });
        });
}); */

// delete a game
router.delete("/gameslist/:gameId", (req, res, next) => {
    const {gameId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }
    /*Game.findByIdAndDelete(gameId)
    .then(() => {
        res.json(`game ${gameId} has been successfully deleted`)
    })
    .catch((err) => {
        console.log("error while deleting a game", err);
        res.status(500).json({message: "error while creating a game"})
    }) */

        Game.findById(gameId)
        .then((gameToDelete) => {
            if (gameToDelete) {
                // Retirer le jeu de l'ownedGames de l'utilisateur
                User.findOneAndUpdate(
                    { _id: gameToDelete.owner },
                    { $pull: { ownedGames: gameId } },  // retirer le jeu de l'utilisateur
                    { new: true }
                )
                .then(() => {
                    // Maintenant, on supprime le jeu de la base de données
                    Game.findByIdAndDelete(gameId)
                        .then(() => {
                            res.json(`Game ${gameId} has been successfully deleted`);
                        })
                        .catch((err) => {
                            console.log("Error while deleting the game", err);
                            res.status(500).json({ message: "Error while deleting the game" });
                        });
                })
                .catch((err) => {
                    console.log("Error updating user's ownedGames during game deletion", err);
                    res.status(500).json({ message: "Error updating user's ownedGames during game deletion" });
                });
            } else {
                res.status(404).json({ message: "Game not found" });
            }
        })
        .catch((err) => {
            console.log("Error while finding the game", err);
            res.status(500).json({ message: "Error while finding the game" });
        });

})


module.exports = router;