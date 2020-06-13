const { User, validateUser } = require("../models/user");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const users = await User.find().select("-password -__v").sort("username");

  res.send(users);
});

router.post("/", [auth, admin, validate(validateUser)], async (req, res) => {
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

  res.send(
    _.pick(user, ["_id", "username", "firstname", "lastname", "isAdmin"])
  );
});

router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const payload = req.body;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  });

  if (!user)
    return res.status(404).send("The user with the given id was not found.");

  res.send(
    _.pick(user, ["_id", "username", "firstname", "lastname", "isAdmin"])
  );
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given id was not found.");

  res.send(
    _.pick(user, ["_id", "username", "firstname", "lastname", "isAdmin"])
  );
});

router.get("/:id", validateObjectId, async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user)
    return res.status(404).send("The user with the given id was not found.");

  res.send(
    _.pick(user, ["_id", "username", "firstname", "lastname", "isAdmin"])
  );
});

module.exports = router;
