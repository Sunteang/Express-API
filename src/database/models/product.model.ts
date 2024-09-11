import { Schema, model } from "mongoose";

export interface IItem {
  name: string;
  category: string;
  price: number;
}

const itemSchema = new Schema({
  name: { type: String, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true },
});

const ItemModel = model<IItem>("items", itemSchema);

export default ItemModel;
