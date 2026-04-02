import mongoose from "mongoose";

const { Schema } = mongoose;

const recordSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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