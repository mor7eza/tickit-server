const { ObjectId, Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: { type: String, default: "USER" },
    departments: [
      {
        type: ObjectId,
        ref: "Department"
      }
    ]
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
