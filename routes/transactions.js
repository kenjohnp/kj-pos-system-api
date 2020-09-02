const auth = require("../middleware/auth");
const { Counter } = require("../models/counter");
const moment = require("moment");
const express = require("express");
const router = express.Router();

router.get("/generateId", [auth], async (req, res) => {
  const transactionId = await generateId();
  res.send(transactionId);
});

router.post("/", [auth], async (req, res) => {
  incrementId();
  res.send(counter);
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

module.exports = router;
