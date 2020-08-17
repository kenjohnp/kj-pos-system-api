const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const validate = require("../middleware/validate");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", validate(validateUser), async (req, res) => {
  const errorMessage = "Invalid username or password.";
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send(errorMessage);

  const password = await bcrypt.compare(req.body.password, user.password);
  if (!password) return res.status(400).send(errorMessage);

  const token = user.generateAuthToken();

  res.send(token);
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(user);
}

module.exports = router;
