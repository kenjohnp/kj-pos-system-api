const validate = require("../middleware/validate");
const { Product, validateProduct } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ description: 1 });

  res.send(products);
});

router.post("/", validate(validateProduct), async (req, res) => {
  const { barcode, description } = req.body;

  const existingBarcode = await Product.findOne({
    barcode,
  });
  if (existingBarcode) return res.status(400).send("Barcode already exists");

  let product = await Product.findOne({
    description,
  });
  if (product) return res.status(400).send("Product already exists");

  product = new Product(req.body);

  await product.save();

  res.send(product);
});

module.exports = router;
