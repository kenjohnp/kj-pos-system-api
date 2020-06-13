const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const productSchema = {
  barcode: {
    type: String,
  },
  description: {
    type: String,
    required: true,
    max: 255,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Number,
    required: true,
  },
  criticalStock: {
    type: Number,
  },
};

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    barcode: Joi.string().allow("").label("Barcode"),
    description: Joi.string().required().max(255).label("Description"),
    category: Joi.objectId().label("Category"),
    price: Joi.number().required().label("Price"),
    inStock: Joi.number().required().label("In Stock"),
    criticalStock: Joi.number().label("Critical Stock"),
  });

  return schema.validate(product, { allowUnknown: true });
}

exports.Product = Product;
exports.validateProduct = validateProduct;
