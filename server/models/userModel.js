const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSubAdmin: {
      type: Boolean,
      default: false,
    },
    allowedTests: {
      type: [mongoose.Schema.Types.ObjectId], // Array of exam IDs the sub-admin can access
      ref: "exams",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
