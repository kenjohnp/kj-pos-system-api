const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Product, validateProduct } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .sort({ description: 1 });

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

  const result = await Product.findOne({
    _id: product._id,
  }).populate("category", "name");

  res.send(result);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateProduct)],
  async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).populate("category", "name");

    if (!product)
      return res
        .status(404)
        .send("The product with the given id was not found.");

    res.send(product);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given id was not found.");

  res.send(product);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "category",
    "name"
  );

  if (!product)
    return res.status(404).send("The product with the given id was not found.");

  res.send(product);
});

module.exports = router;
