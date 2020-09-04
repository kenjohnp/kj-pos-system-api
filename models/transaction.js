const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const transactionItems = {
  barcode: {
    type: String,
  },
  itemName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
};

const transactionSchema = {
  transactionNo: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  cashReceived: {
    type: Number,
    required: true,
  },
  items: [transactionItems],
};

const Transaction = mongoose.model("Transaction", transactionSchema);

function validateTransaction(transaction) {
  const schema = Joi.object({
    date: Joi.date().required().label("Date"),
    items: Joi.array()
      .items(
        Joi.object({
          barcode: Joi.string().allow("").label("Barcode"),
          itemName: Joi.string().required().label("Item Name"),
          price: Joi.number().min(0).required().label("Price"),
          qty: Joi.number().min(1).required().label("Qty"),
          discount: Joi.number().min(0).required().label("Discount"),
        })
      )
      .min(1)
      .required()
      .label("Items"),
    cashReceived: Joi.number().min(1).required().label("Cash Received"),
  });

  return schema.validate(transaction);
}

exports.Transaction = Transaction;
exports.validateTransaction = validateTransaction;
