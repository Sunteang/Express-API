// tests/database/repositories/product-repository.int.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ProductRepository from "../../../src/database/repositories/product.repository";
import ItemModel, { IItem } from "../../../src/database/models/product.model";
import { ProductCreateRequest } from "../../../src/controllers/types/product-request.type";

// Increase Jest's default timeout to accommodate slower operations
jest.setTimeout(10000);

describe("ProductRepository - Integration Tests", () => {
  let mongoServer: MongoMemoryServer;

  // Connect to the in-memory database before running the tests
  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: "4.4.6", // Specify a stable MongoDB version
        },
        // Removed 'timeoutMS' as it's unsupported
      });
      const uri = mongoServer.getUri();
      console.log(uri);

      await mongoose.connect(uri);
      console.log("Connected to In-Memory MongoDB.");
    } catch (error) {
      console.error("Failed to start In-Memory MongoDB:", error);
      throw error;
    }
  });

  // Clear all data after each test to ensure test isolation
  afterEach(async () => {
    try {
      await ItemModel.deleteMany({});
    } catch (error) {
      console.error("Error clearing database:", error);
      throw error;
    }
  });

  // Disconnect and stop the in-memory database after all tests are done
  afterAll(async () => {
    try {
      await mongoose.disconnect();
      if (mongoServer) {
        await mongoServer.stop();
        console.log("Disconnected from In-Memory MongoDB.");
      }
    } catch (error) {
      console.error("Error stopping In-Memory MongoDB:", error);
      throw error;
    }
  });

  describe("getAllProducts", () => {
    it("should return paginated products with filters and sorting", async () => {
      const mockProducts: IItem[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 1",
          category: "new",
          price: 100,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 2",
          category: "new",
          price: 150,
        },
      ];

      // Insert mock products into the in-memory database
      await ItemModel.insertMany(mockProducts);

      // Fetch products using the repository method
      const result = await ProductRepository.getAllProducts({
        page: 1,
        limit: 2,
        filter: { category: "new" },
        sort: { name: "desc" },
      });

      // Assertions
      expect(result).toEqual({
        products: expect.arrayContaining([
          expect.objectContaining({ name: "Product 1" }),
          expect.objectContaining({ name: "Product 2" }),
        ]),
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
      });
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProductRequest: ProductCreateRequest = {
        name: "New Product",
        category: "new",
        price: 200,
      };

      // Create a product using the repository
      const result = await ProductRepository.createProduct(newProductRequest);

      // Fetch the product from the in-memory database
      const fetchedProduct = await ItemModel.findById(result._id);

      // Assertions
      expect(fetchedProduct).toMatchObject(newProductRequest);
      expect(result).toMatchObject(newProductRequest);
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const mockProduct = new ItemModel({
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product",
        category: "new",
        price: 100,
      });
      await mockProduct.save();

      // Fetch the product by ID using the repository
      const result = await ProductRepository.getProductById(
        mockProduct._id.toString()
      );

      // Assertions
      expect(result).toEqual(
        expect.objectContaining({ name: "Test Product", category: "new" })
      );
    });

    it("should throw an error if the product is not found", async () => {
      await expect(
        ProductRepository.getProductById(
          new mongoose.Types.ObjectId().toString()
        )
      ).rejects.toThrow("Product not found!");
    });
  });

  describe("updateProduct", () => {
    it("should update a product by ID", async () => {
      const mockProduct = new ItemModel({
        _id: new mongoose.Types.ObjectId(),
        name: "Old Product",
        category: "new",
        price: 150,
      });
      await mockProduct.save();

      // Update the product using the repository
      const updatedData = { name: "Updated Product", price: 250 };
      const result = await ProductRepository.updateProduct(
        mockProduct._id.toString(),
        updatedData
      );

      // Fetch the updated product from the in-memory database
      const updatedProduct = await ItemModel.findById(mockProduct._id);

      // Assertions
      expect(updatedProduct).toMatchObject(updatedData);
      expect(result).toMatchObject(updatedData);
    });

    it("should throw an error if the product is not found", async () => {
      await expect(
        ProductRepository.updateProduct(
          new mongoose.Types.ObjectId().toString(),
          {
            name: "Nonexistent Product",
          }
        )
      ).rejects.toThrow("Product not found!");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by ID", async () => {
      const mockProduct = new ItemModel({
        _id: new mongoose.Types.ObjectId(),
        name: "Product to delete",
        category: "new",
        price: 100,
      });
      await mockProduct.save();

      // Delete the product using the repository
      await ProductRepository.deleteProduct(mockProduct._id.toString());

      // Attempt to find the deleted product
      const deletedProduct = await ItemModel.findById(mockProduct._id);

      // Assertions
      expect(deletedProduct).toBeNull();
    });

    it("should throw an error if the product is not found", async () => {
      await expect(
        ProductRepository.deleteProduct(
          new mongoose.Types.ObjectId().toString()
        )
      ).rejects.toThrow("Product not found!");
    });
  });
});
