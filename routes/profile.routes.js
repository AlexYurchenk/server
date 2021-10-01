const { Router } = require("express");
const { Profile } = require("../models/Profile");
const { User } = require("../models/User");
const router = new Router();
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/post", async (req, res) => {
  try {
    const { name, city, gander } = req.body;
    const profile = new Profile({ name, city, gander });
    return res.json({
      id: profile.id,
      name: profile.name,
      city: profile.city,
      gander: profile.gander,
    });
  } catch (e) {
    res.send({
      message: "Server  error",
      error: `${e.message}`,
    });
  }
});
router.delete("/delete/:id?", async (req, res) => {
  //id профиля что удаляем
  const { profileId } = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.verify(token, config.get("secretKey")).id;
  try {
    const user = await Profiles.findOne({ _id: userId });
    const profile = await Profiles.findOne({ _id: profileId });

    console.log(profile.user === userId);
    console.log(user.id === userId);
    if (profile.user === userId || user.isAdmin) {
      await Profiles.deleteOne({ _id: id });
      return res.json({
        message: "delete was success",
      });
    }
    return res.json({
      message: "delete wasnt success",
    });
  } catch (e) {
    res.send({
      message: "Server  error",
      error: `${e.message}`,
    });
  }
});

module.exports = router;
