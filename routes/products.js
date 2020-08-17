const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Product, validateProduct } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .sort({ description: 1 });

  res.send(products);
});

router.post("/", [auth, admin, validate(validateProduct)], async (req, res) => {
  const { barcode, description } = req.body;

  if (barcode !== "") {
    const existingBarcode = await Product.findOne({
      barcode,
    });
    if (existingBarcode) return res.status(400).send("Barcode already exists");
  }

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
  [auth, admin, validateObjectId, validate(validateProduct)],
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

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given id was not found.");

  res.send(product);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "category",
    "name"
  );

  if (!product)
    return res.status(404).send("The product with the given id was not found.");

  res.send(product);
});

module.exports = router;
