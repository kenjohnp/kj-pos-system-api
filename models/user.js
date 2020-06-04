const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    // minlength: 5,
    // maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 1024,
  },
  firstname: {
    type: String,
    // required: true,
    maxlength: 255,
  },
  lastname: {
    type: String,
    // required: true,
    maxlength: 255,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );

  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().required().min(5).max(50).label("Username"),
    password: Joi.string().required().min(5).max(50).label("Password"),
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
