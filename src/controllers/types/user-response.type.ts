import { IItem } from "../../database/models/product.model";

export interface ProductResponse {
  message: string;
  data: IItem;
}
