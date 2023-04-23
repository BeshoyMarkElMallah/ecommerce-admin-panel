import mongoose, { Schema, models, model } from "mongoose";

const CatgeorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
});

export const Category = models.Category || model("Category", CatgeorySchema);
