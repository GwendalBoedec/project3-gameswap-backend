const { Schema, model } = require("mongoose");

const requestSchema = new Schema( {
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    requestedGame: {
        type: Schema.Types.ObjectId,
        ref: "Game", 
        required: true
    },
    offeredGame: {
        type: Schema.Types.ObjectId,
        ref: "Game", 
        required: true
    },
    comment: {
        type: String
    },
    contactDetails: {
        type: String,
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

