const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const itemsSchema = {
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 255,
  },
  qty: {
    type: Number,
    min: 1,
  },
};

const stockEntrySchema = {
  stockInBy: {
    type: String,
    required: true,
  },
  supplier: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  refNo: {
    type: String,
    max: 50,
  },
  remarks: {
    type: String,
    max: 255,
  },
  items: [itemsSchema],
  status: String,
};

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

function validateStockEntry(stockEntry) {
  const schema = Joi.object({
    stockInBy: Joi.string().required().label("Stock In By"),
    supplier: Joi.object({
      _id: Joi.objectId().required().label("Supplier ID"),
      name: Joi.string().required().label("Supplier Name"),
    })
      .required()
      .label("Supplier"),
    date: Joi.date().required().label("Stock In Date"),
    remarks: Joi.string().allow("").label("Remarks"),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.objectId().required().label("Product ID"),
        description: Joi.string()
          .max(255)
          .required()
          .label("Product Description"),
        qty: Joi.number().min(1).required().label("Qty"),
      })
    ),
  });

  return schema.validate(stockEntry, { allowUnknown: true });
}

exports.StockEntry = StockEntry;
exports.validateStockEntry = validateStockEntry;
