const { Schema, model } = require("mongoose");

const Profile = new Schema({
  name: { type: String, require: true, unique: false },
  city: { type: String, require: true },
  gander: { type: String },
  user: { type: Number },
});
const profileModel = model("Profile", Profile);
module.exports = {
  Profile: profileModel,
};
