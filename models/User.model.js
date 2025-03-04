const { Schema, model } = require("mongoose");

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
      type: [String],
      enum: ["gameboy", "gameboy advanced", "gamecube", "NES", "nintendo 64", "super nintendo", "playstation 1", "playstation 2", "PSP", "Xbox"]
    },
    favoriteGameStyles: {
      type: [String],
      enum: ["adventure", "fight", "FPS", "platform", "racing", "RPG", "strategy"]
    },
    
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }

);

const User = model("User", userSchema);

module.exports = User;
