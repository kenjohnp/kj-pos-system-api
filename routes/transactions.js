const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Counter } = require("../models/counter");
const { Transaction, validateTransaction } = require("../models/transaction");
const moment = require("moment");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const transactions = await Transaction.find().sort({ transactionNo: -1 });

  res.send(transactions);
});

router.post("/", [auth, validate(validateTransaction)], async (req, res) => {
  const transactionNo = await generateId();

  const { date, cashReceived, items } = req.body;

  if (!validateCashReceived(cashReceived, items))
    return res.status(400).send("Insufficient cash received.");

  let transaction = {
    transactionNo,
    date,
    cashReceived,
    items,
  };

  transaction = new Transaction(transaction);

  await transaction.save();

  incrementId();

  res.send(transaction);
});

router.get("/generateId", [auth], async (req, res) => {
  const transactionId = await generateId();
  res.send(transactionId);
});

const generateId = async () => {
  let counter = await Counter.findOne({ counterType: "transaction" });

  if (!counter) {
    counter = new Counter({
      counterType: "transaction",
      value: 0,
      dateGenerated: moment(),
    });
    await counter.save();
  }

  if (
    moment(counter.dateGenerated).format("YYYYMMDD") !==
    moment().format("YYYYMMDD")
  )
    resetCounter();

  const transactionId =
    moment().format("YYYYMMDD").toString() +
    String(counter.value).padStart(5, "0");

  return transactionId;
};

const incrementId = async () => {
  counter = await Counter.findOneAndUpdate(
    { counterType: "transaction" },
    {
      $inc: {
        value: 1,
      },
    },
    {
      new: true,
    }
  );
};

const resetCounter = async () => {
  counter = await Counter.findOneAndUpdate(
    { counterType: "transaction" },
    {
      value: 1,
      dateGenerated: moment(),
    },
    {
      new: true,
    }
  );
};

const validateCashReceived = (cashReceived, items) => {
  const totalAmount = items.reduce((a, b) => a + b.price, 0);

  if (cashReceived - totalAmount < 0) return false;

  return true;
};

module.exports = router;
