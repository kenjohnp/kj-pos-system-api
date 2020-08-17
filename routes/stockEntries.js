const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { StockEntry, validateStockEntry } = require("../models/stockEntry");
const { Product } = require("../models/product");
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
    const { supplier, date, refNo, remarks } = req.body;

    let stockEntry = {
      supplier: {
        _id: supplier._id,
        name: supplier.name,
      },
      date,
      refNo,
      remarks,
      status: "Added to Stock",
    };

    stockEntry = new StockEntry(stockEntry);

    await stockEntry.save();

    const products = req.body.items.map(
      async (i) =>
        await Product.findByIdAndUpdate(
          { _id: i.productId },
          {
            $inc: {
              inStock: i.qty,
            },
          },
          {
            new: true,
          }
        )
    );

    res.send(stockEntry);
  }
);
1;
router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const stockEntry = await StockEntry.findOne({ _id: req.params.id });

  if (!stockEntry)
    return res
      .status(404)
      .send("The stock entry with the given id was not found.");
  res.send(stockEntry);
});

module.exports = router;
