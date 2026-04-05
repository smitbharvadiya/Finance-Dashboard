import mongoose from "mongoose";

const { Schema } = mongoose;

const recordSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  transactionId: {
    type: String,
    unique: true,
    default: () => "TRX-" + Date.now() + "-" + Math.floor(Math.random() * 1000)
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Success", "Pending", "Failed"],
    default: "Success",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  note: {
    type: String,
  }

}, {
  timestamps: true
});

export default mongoose.model("Record", recordSchema);