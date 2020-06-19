const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const supplierSchema = {
  name: {
    type: String,
    max: 255,
    required: true,
  },
  address: {
    type: String,
    max: 255,
  },
  contactPerson: {
    type: String,
    max: 255,
  },
  contactNumber: {
    type: String,
    max: 50,
  },
  fax: {
    type: String,
    max: 50,
  },
  email: {
    type: String,
    max: 255,
  },
};

const Supplier = mongoose.model("Supplier", supplierSchema);

function validateSupplier(supplier) {
  const schema = Joi.object({
    name: Joi.string().required().label("Supplier Name"),
    address: Joi.string().allow("").max(255).label("Address"),
    contactPerson: Joi.string().allow("").max(255).label("Contact Person"),
    contactNumber: Joi.string().allow("").max(50).label("Contact Number"),
    fax: Joi.string().allow("").max(50).label("Fax"),
    email: Joi.string().email().allow("").max(255).label("Email"),
  });

  return schema.validate(supplier, { allowUnknown: true });
}

exports.Supplier = Supplier;
exports.validateSupplier = validateSupplier;
