const mongoose = require("mongoose");

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
  amountTendered: {
    type: Number,
    required: true,
  },
  items: [transactionItems],
};

const Transaction = mongoose.model("Transaction", transactionSchema);

exports.Transaction = Transaction;
