// src/controllers/ItemController.ts
import {
  Controller,
  Route,
  Body,
  Post,
  Path,
  Get,
  Put,
  Delete,
  Response,
  Middlewares,
  Queries,
} from "tsoa";
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "@/src/controllers/types/product-request.type";
import { IItem } from "@/src/database/models/product.model";
import ProductService from "@/src/services/product.service";
import productCreateSchema from "@/src/schema/product.schema";
import validateRequest from "../middlewares/validate-input";
import {
  ProductPaginatedResponse,
  ProductResponse,
} from "./types/product-response.type";

@Route("v1/products")
export class ProductController extends Controller {
  @Get()
  public async getAllProducts(
    @Queries() queries: ProductGetAllRequest
  ): Promise<ProductPaginatedResponse> {
    try {
      const response = await ProductService.getAllProducts(queries);
      return {
        message: "Success",
        data: response,
      };
    } catch (error) {
      console.error(
        `ProductController - getAllProducts() method error: ${error}`
      );
      throw error;
    }
  }

  @Post()
  @Response(201, "Created success")
  @Middlewares(validateRequest(productCreateSchema))
  public async createItem(
    @Body() requestBody: ProductCreateRequest
  ): Promise<IItem> {
    try {
      const newProduct = await ProductService.createProduct(requestBody);

      return {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get the specific item base on id: /v1/products/1234...
  @Get("{id}")
  public async getItemById(@Path() id: string): Promise<ProductResponse> {
    try {
      const product = await ProductService.getProductById(id);

      return {
        message: "success",
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }

  //Update the specific item base on id: /v1/products/123..
  @Put("{id}")
  public async updateItem(
    @Path() id: string,
    @Body() requestBody: ProductUpdateRequest
  ): Promise<ProductResponse> {
    try {
      const updateProduct = await ProductService.updateProduct(id, requestBody);

      return { message: "success", data: updateProduct };
    } catch (error) {
      throw error;
    }
  }

  @Delete("{id}")
  @Response(204, "Delete Success")
  public async deleteItemById(@Path() id: string): Promise<void> {
    try {
      await ProductService.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
}
