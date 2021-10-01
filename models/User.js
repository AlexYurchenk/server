const { Schema, model } = require("mongoose");

const User = new Schema({
  email: { type: String, require: true, unique: false },
  password: { type: String, require: true },
  profileCount: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  profile: [{ type: Object }],
  name: { type: String, require: true },
  isOnline: { type: Boolean, require: false },
});
const userModel = model("User", User);
module.exports = {
  User: userModel,
};
