const mongoose = require("mongoose");

const Counter = mongoose.model("Counter", {
  counterType: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    min: 0,
    required: true,
  },
  dateGenerated: {
    type: Date,
    required: true,
  },
});

exports.Counter = Counter;
