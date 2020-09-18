const { ObjectId, model, Schema } = require("mongoose");

const ticketSchema = new Schema(
  {
    ticketCode: String,
    subject: String,
    body: String,
    status: { type: String, default: "PENDING" },
    user: { type: ObjectId, ref: "User" },
    department: { type: ObjectId, ref: "Department" },
    comments: [
      {
        id: ObjectId,
        user: { type: ObjectId, ref: "User" },
        body: String,
        createdAt: { type: String, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = model("Ticket", ticketSchema);
