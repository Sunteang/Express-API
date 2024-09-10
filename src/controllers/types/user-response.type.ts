import { IItem } from "@/src/database/models/product.model";

export interface ProductResponse {
  message: string;
  data: IItem;
}
