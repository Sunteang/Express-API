// src/services/product.service.ts
import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "@/src/controllers/types/product-request.type";
import { IItem } from "@/src/database/models/product.model";
import productRepository from "../database/repositories/product.repository";
export class ProductService {
  public async getAllProducts(queries: ProductGetAllRequest) {
    try {
      const { page, limit, filter, sort } = queries;

      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter), 
        sort: sort && JSON.parse(sort) 
      };

      const result = await productRepository.getAllProducts(newQueries); //getAll to getAllProduct

      return result;
    } catch (error) {
      console.error(`ProductService - getAllProducts() method error: ${error}`);
      throw error;
    }
  }

  public async getProductById(id: string): Promise<IItem> {
    try {
      const product = await productRepository.getProductById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<IItem> {
    try {
      const newProduct = await productRepository.createProduct(productRequest);
      return newProduct;
    } catch (error) {
      console.log(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }

  public async updateProduct(
    id: string,
    productRequest: ProductUpdateRequest
  ): Promise<IItem> {
    try {
      const updatedProduct = await productRepository.updateProduct(
        id,
        productRequest
      );
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      await productRepository.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
