const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const categories = require("../routes/categories");
const products = require("../routes/products");
const suppliers = require("../routes/suppliers");
const stockEntries = require("../routes/stockEntries");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/categories", categories);
  app.use("/api/products", products);
  app.use("/api/suppliers", suppliers);
  app.use("/api/stockentries", stockEntries);
  app.use(error);
};
