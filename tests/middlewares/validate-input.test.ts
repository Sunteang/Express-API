import validateRequest from "../../src/middlewares/validate-input";
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

describe("validateRequest Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it("should call next() if validation passes", () => {
    // Define a Joi schema for product testing
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      category: Joi.string()
        .valid("electronics", "fashion", "beauty", "books", "sports")
        .required(),
      price: Joi.number().greater(0.01).required(),
    });

    // Set valid request body
    req.body = { name: "Test Product", category: "electronics", price: 100.99 };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Expect next() to be called since the validation passed
    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return an error if validation fails (name too short)", () => {
    // Define a Joi schema for product testing
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      category: Joi.string()
        .valid("electronics", "fashion", "beauty", "books", "sports")
        .required(),
      price: Joi.number().greater(0.01).required(),
    });

    // Set invalid request body (name is too short)
    req.body = { name: "JD", category: "electronics", price: 100.99 };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Expect next() to be called with an error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return an error if category is invalid", () => {
    // Define a Joi schema for product testing
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      category: Joi.string()
        .valid("electronics", "fashion", "beauty", "books", "sports")
        .required(),
      price: Joi.number().greater(0.01).required(),
    });

    // Set invalid request body (invalid category)
    req.body = {
      name: "Test Product",
      category: "invalid-category",
      price: 100.99,
    };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Expect next() to be called with an error due to invalid category
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return an error if price is missing", () => {
    // Define a Joi schema for product testing
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      category: Joi.string()
        .valid("electronics", "fashion", "beauty", "books", "sports")
        .required(),
      price: Joi.number().greater(0.01).required(),
    });

    // Set invalid request body (missing price)
    req.body = { name: "Test Product", category: "electronics" };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Expect next() to be called with an error due to missing price
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return an error if price is less than 0.01", () => {
    // Define a Joi schema for product testing
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      category: Joi.string()
        .valid("electronics", "fashion", "beauty", "books", "sports")
        .required(),
      price: Joi.number().greater(0.01).required(),
    });

    // Set invalid request body (price less than 0.01)
    req.body = { name: "Test Product", category: "electronics", price: 0.001 };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Expect next() to be called with an error due to too low price
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
  
  it("should return an error if validation fails (name too short)", () => {
    // Define a Joi schema for product testing
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      category: Joi.string()
        .valid("electronics", "fashion", "beauty", "books", "sports")
        .required(),
      price: Joi.number().greater(0.01).required(),
    });
  
    // Set invalid request body (name is too short)
    req.body = { name: "JD", category: "electronics", price: 100.99 };
  
    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);
  
    // Check if next was called with an error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    
    // Ensure that the error passed to next() is an instance of Error
    const errorArg = (next as jest.Mock).mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toContain("name");
  });
  
});
