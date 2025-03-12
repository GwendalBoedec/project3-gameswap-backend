const { Schema, model } = require("mongoose");
const CONSOLE_PROPERTY = require("../config/CONSOLE_PROPERTY");
const GAMESTYLE_PROPERTY = require("../config/GAMESTYLE_PROPERTY");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "username is required."],
    },
    city: {
      type: String,
    },
    phonenumber: {
      type: Number,
    },
    favoriteConsoles: {
      ...CONSOLE_PROPERTY,
    },
    favoriteGameStyles: {
      ...GAMESTYLE_PROPERTY
    },
    ownedGames: [{
    type: Schema.Types.ObjectId, 
    ref: "Game"
    }]

    
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }

);

const User = model("User", userSchema);

module.exports = User;
