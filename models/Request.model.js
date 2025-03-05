const { Schema, model } = require("mongoose");

const requestSchema = new Schema( {
    requestedGame: {
        type: Schema.Types.ObjectId,
        ref: "Game", 
        required: true
    },
    offeredGame: {
        type: Schema.Types.ObjectId,
        ref: "Game", 
        required: true
    }
},

{
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Request = model("Request", requestSchema);
module.exports = Request

