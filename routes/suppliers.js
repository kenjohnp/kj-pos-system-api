const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Supplier, validateSupplier } = require("../models/supplier");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const suppliers = await Supplier.find().sort({ name: 1 });

  res.send(suppliers);
});

router.post(
  "/",
  [auth, admin, validate(validateSupplier)],
  async (req, res) => {
    const { name } = req.body;

    const isExists = await Supplier.findOne({ name });
    if (isExists) return res.status(400).send("Supplier Name already exists.");

    const supplier = new Supplier(req.body);

    await supplier.save();

    res.send(supplier);
  }
);

router.put(
  "/:id",
  [auth, admin, validateObjectId, validate(validateSupplier)],
  async (req, res) => {
    const supplier = await Supplier.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!supplier)
      return res
        .status(404)
        .send("The supplier with the given id was not found.");

    res.send(supplier);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const supplier = await Supplier.findByIdAndRemove(req.params.id);

  if (!supplier)
    return res
      .status(404)
      .send("The supplier with the given id was not found.");

  res.send(supplier);
});

router.get("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const supplier = await Supplier.findOne({ _id: req.params.id });

  if (!supplier)
    return res
      .status(404)
      .send("The supplier with the given id was not found.");

  res.send(supplier);
});

module.exports = router;
