const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const { StockEntry, validateStockEntry } = require("../models/stockEntry");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const stockEntries = await StockEntry.find().sort({ date: -1 });

  res.send(stockEntries);
});

router.post(
  "/",
  [auth, admin, validate(validateStockEntry)],
  async (req, res) => {
    const stockEntry = new StockEntry(req.body);

    await stockEntry.save();

    res.send(stockEntry);
  }
);

module.exports = router;
