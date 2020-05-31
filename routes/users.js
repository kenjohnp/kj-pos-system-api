const { User, validateUser } = require("../models/user");
const validate = require("../middleware/validate");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().select("-password -__v").sort("username");
  res.send(users);
});

router.post("/", validate(validateUser), async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("Username already exists.");

  user = new User(
    _.pick(req.body, [
      "username",
      "password",
      "firstname",
      "lastname",
      "isAdmin",
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["username", "firstname", "lastname", "isAdmin"]));
});

module.exports = router;
