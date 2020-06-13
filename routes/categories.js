const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Category, validateCategory } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.send(categories);
});

router.post(
  "/",
  [auth, admin, validate(validateCategory)],
  async (req, res) => {
    let category = await Category.findOne({ name: req.body.name });

    if (category) return res.status(400).send("Category Name already exists.");

    category = new Category({ name: req.body.name, enabled: req.body.enabled });

    await category.save();

    res.send(category);
  }
);

router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!category)
    return res
      .status(404)
      .send("The category with the given id was not found.");

  res.send(category);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The category with the given id was not found.");

  res.send(category);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });

  if (!category)
    return res
      .status(404)
      .send("The category with the given id was not found.");

  res.send(category);
});

module.exports = router;
