const { Schema, model } = require("mongoose");
const CONSOLE_PROPERTY = require("../config/CONSOLE_PROPERTY");
const GAMESTYLE_PROPERTY = require("../config/GAMESTYLE_PROPERTY");

const gameSchema = new Schema ({
owner: {
    type: Schema.Types.ObjectId, 
    ref: "User"
},
title: {
    type: String,
    required: true
},
image: {
    type: String
},
console: {
    ...CONSOLE_PROPERTY
},
gameStyle: {
    ...GAMESTYLE_PROPERTY
},
purchaseYear: {
    type: Date,
    required: true,
    default: "unknown"
},
condition: {
    type: String,
    required: true,
    enum: ["OK", "good", "very good", "intact"]
},
conditionCertificate: {
    type: Boolean,
    default: false,
},
availableForTrade: {
    type: Boolean,
    default: false,
},
},

{
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }

)

const Game = model("Game", gameSchema);

module.exports = Game;




