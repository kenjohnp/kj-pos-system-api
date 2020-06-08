const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enabled: Boolean,
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().required().label("Category Name"),
    enabled: Joi.boolean(),
  });

  return schema.validate(category, { allowUnknown: true });
}

exports.Category = Category;
exports.validateCategory = validateCategory;
