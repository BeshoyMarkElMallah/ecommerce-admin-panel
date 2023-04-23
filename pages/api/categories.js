import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import React from "react";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    const categories = await Category.find().populate("parent");
    res.json(categories);
  }

  if (method === "POST") {
    const { name, parentCategory } = req.body;
    const catgeoryDoc = await Category.create({ name, parent: parentCategory });
    res.json(catgeoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      {
        _id,
      },
      {
        name,
        parent: parentCategory,
      }
    );
    res.json(categoryDoc);
  }

    if (method === "DELETE") {
    const { _id } = req.query;
    const categoryDoc = await Category.deleteOne({
        _id,
    });
    res.json(categoryDoc);
    }
}
