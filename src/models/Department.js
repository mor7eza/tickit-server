const { model, Schema } = require("mongoose");

const departmentSchema = new Schema(
  {
    name: String
  },
  { timestamps: true }
);

module.exports = model("Department", departmentSchema);
