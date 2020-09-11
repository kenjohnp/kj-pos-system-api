const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Counter } = require("../models/counter");
const { Transaction, validateTransaction } = require("../models/transaction");
const Fawn = require("fawn");
const moment = require("moment");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const transactions = await Transaction.find().sort({ transactionNo: -1 });

  res.send(transactions);
});

router.post("/", [auth, validate(validateTransaction)], async (req, res) => {
  const transactionNo = await generateId();

  const existingTransactionNo = await Transaction.find({ transactionNo });

  if (existingTransactionNo.length)
    return res.status(400).send("Duplicated Transaction No.");

  const { date, cashReceived, items } = req.body;

  const validateDiscounts = items.find((i) => i.price < i.discount);

  if (validateDiscounts) return res.status(400).send("Discount error.");

  if (!validateCashReceived(cashReceived, items))
    return res.status(400).send("Insufficient cash received.");

  const totalSales = items.reduce(
    (a, b) => a + (b.price - b.discount) * b.qty,
    0
  );

  let transaction = {
    transactionNo,
    date,
    cashReceived,
    items,
    totalSales,
  };

  const task = Fawn.Task();

  task.save("transactions", transaction);
  task.update(
    "counters",
    { counterType: "transaction" },
    {
      $inc: {
        value: 1,
      },
    }
  );

  items.map((i) =>
    task.update(
      "products",
      { _id: i.productId },
      {
        $inc: {
          inStock: -i.qty,
        },
      }
    )
  );

  task
    .run({ useMongoose: true })
    .then(() => {
      res.send(transaction);
    })
    .catch((err) => {
      res.status(500).send("Transaction failed.");
    });
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
  const totalAmount = items.reduce((a, b) => a + (b.price - b.discount), 0);

  if (cashReceived - totalAmount < 0) return false;

  return true;
};

module.exports = router;
