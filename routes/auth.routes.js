const { Router } = require("express");
const { User } = require("../models/User");
const router = new Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  [
    check("email", "Uncorrect email").isEmail(),
    check("password", "Uncorrect password").isLength({ min: 3, max: 12 }),
  ];
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Uncorect request", errors });
    }
    const { email, password, name } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res
        .status(400)
        .json({ massage: `User with  email ${email} already exist` });
    }
    const hashPassword = await bcrypt.hash(password, 8);
    const user = new User({ email, password: hashPassword, name });
    await user.save();
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "730h",
    });
    return res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    res.send({
      message: "Server  error",
      error: `${e.message}`,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "730h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profileCount: user.profileCount,
        profile: user.profile,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    });
  } catch (e) {
    res.send({
      message: "Server  error",
      error: `${e.message}`,
    });
  }
});
router.get("/current", async (req, res) => {
  console.log(req);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, config.get("secretKey"));

    const user = await User.findOne({ id });
    return res.json({
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    res.send({
      message: "Server  error",
      error: `${e.message}`,
    });
  }
});
module.exports = router;
