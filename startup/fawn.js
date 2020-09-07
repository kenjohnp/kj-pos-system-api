const Fawn = require("fawn");
const mongoose = require("mongoose");

module.exports = () => Fawn.init(mongoose);
