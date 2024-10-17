// import request from "supertest";
// import app from "../../src/app";
// import { IItem } from "../../src/database/models/product.model";
// import connectToMongoDB from "../../src/database/connection";
// import { HTTP_STATUS_CODE } from "../../src/utils/constants/status-code";
// import mongoose from "mongoose";
// import configs from "../../src/config";

// let createProductId: string;

// // Use custom MongoDB connection function
// beforeAll(async () => {
//   await mongoose.connect(configs.mongodbUrl); // Use your custom connection logic if needed
//   console.log("Connected to MongoDB for testing");
// }, 60000); // Increase Jest timeout for beforeAll

// // Cleanup after tests
// afterAll(async () => {
//   if (createProductId) {
//     await request(app).delete(`/v1/products/${createProductId}`);
//     console.log(`Deleted product with ID: ${createProductId}`);
//   }

//   await mongoose.disconnect();
//   console.log("Disconnected from MongoDB after testing");
// }, 60000); // Increase Jest timeout for afterAll

// describe("GET /v1/products/{productId}", () => {
//   beforeAll(async () => {
//     // Create a new product for testing
//     const newProduct: IItem = {
//       name: "Macbook Air",
//       category: "electronics",
//       price: 100.99,
//     };

//     try {
//       const response = await request(app).post("/v1/products").send(newProduct);
//       expect(response.status).toBe(HTTP_STATUS_CODE.CREATED);

//       // Log the response to understand its structure
//       console.log("Product creation response:", response.body);

//       createProductId = response.body.data?._id;
//       console.log("Created Product ID:", createProductId);
//     } catch (error) {
//       console.error("Error creating product in beforeAll:", error);
//     }
//   }, 60000); // Increase timeout for creating product

//   // Test for retrieving a product by its ID
//   it("should return a product for a given productId", async () => {
//     expect(createProductId).toBeDefined();

//     const response = await request(app)
//       .get(`/v1/products/${createProductId}`)
//       .expect("Content-Type", /json/)
//       .expect(HTTP_STATUS_CODE.SUCCESS);

//     expect(response.body).toHaveProperty("data");
//     expect(response.body.data).toHaveProperty("_id", createProductId);
//     expect(response.body.data).toHaveProperty("name", "Macbook Air");
//     expect(response.body.data).toHaveProperty("category", "electronics");
//     expect(response.body.data).toHaveProperty("price", 100.99);
//   }, 60000); // Increase timeout for the test case

//   // Test for non-existent product ID
//   it("should return 404 for a non-existent productId", async () => {
//     // Use a valid non-existent product ID (24-character hexadecimal string)
//     const nonExistentProductId = "66849e01b47f6b60c073b480";
//     const response = await request(app)
//       .get(`/v1/products/${nonExistentProductId}`)
//       .expect("Content-Type", /json/)
//       .expect(HTTP_STATUS_CODE.NOT_FOUND);

//     expect(response.body).toHaveProperty(
//       "message",
//       "The requested resource was not found."
//     );
//   }, 60000); // Increase timeout for the test case
// });

import request from "supertest";
import app from "../../src/app";
import { IItem } from "../../src/database/models/product.model";
import connectToMongoDB from "../../src/database/connection";
import { HTTP_STATUS_CODE } from "../../src/utils/constants/status-code";
import mongoose from "mongoose";

let createProductId: string;

beforeAll(async () => {
  await connectToMongoDB(); // Ensure this function is using the correct connection string
  console.log("Connected to MongoDB for testing");
}, 60000); // Increase Jest timeout for beforeAll

afterAll(async () => {
  if (createProductId) {
    await request(app).delete(`/v1/products/${createProductId}`);
    console.log(`Deleted product with ID: ${createProductId}`);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB after testing");
}, 60000); // Increase Jest timeout for afterAll

describe("GET /v1/products/{productId}", () => {
  beforeAll(async () => {
    const newProduct: IItem = {
      name: "Macbook Air",
      category: "electronics",
      price: 100.99,
    };

    try {
      const response = await request(app).post("/v1/products").send(newProduct);
      console.log("Product creation response:", response.body); // Log response body for debugging

      expect(response.status).toBe(HTTP_STATUS_CODE.CREATED);
      createProductId = response.body.data?._id;
      console.log("Created Product ID:", createProductId);
    } catch (error) {
      console.error("Error creating product in beforeAll:", error); // Log any errors during product creation
    }
  }, 60000); // Increase timeout for creating product

  it("should return a product for a given productId", async () => {
    expect(createProductId).toBeDefined();

    const response = await request(app)
      .get(`/v1/products/${createProductId}`)
      .expect("Content-Type", /json/)
      .expect(HTTP_STATUS_CODE.SUCCESS);

    console.log("GET /v1/products/{productId} response:", response.body); // Log response body

    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("_id", createProductId);
    expect(response.body.data).toHaveProperty("name", "Macbook Air");
    expect(response.body.data).toHaveProperty("category", "electronics");
    expect(response.body.data).toHaveProperty("price", 100.99);
  }, 60000);

  it("should return 404 for a non-existent productId", async () => {
    const nonExistentProductId = "66849e01b47f6b60c073b480";
    const response = await request(app)
      .get(`/v1/products/${nonExistentProductId}`)
      .expect("Content-Type", /json/)
      .expect(HTTP_STATUS_CODE.NOT_FOUND);

    console.log("GET /v1/products/{nonExistentProductId} response:", response.body); // Log response body

    expect(response.body).toHaveProperty(
      "message",
      "The requested resource was not found."
    );
  }, 60000);
});
