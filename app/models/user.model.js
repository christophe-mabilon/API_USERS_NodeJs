import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    tv: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tv"
      }
    ]
  })
);

export default User;
