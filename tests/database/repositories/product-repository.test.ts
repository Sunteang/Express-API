import ProductRepository from "../../../src/database/repositories/product.repository";
import ItemModel, { IItem } from "../../../src/database/models/product.model";

// Mock the Mongoose model and chainable query methods
jest.mock("../../../src/database/models/product.model");

describe("ProductRepository", () => {
  let mockProduct: IItem;

  beforeEach(() => {
    mockProduct = {
      id: "1",
      name: "Test Product",
      price: 100,
      category: "electronics",
    } as IItem;

    jest.clearAllMocks();

    // Mock chainable query methods
    (ItemModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockProduct]), // Return resolved value for the final query
    });

    (ItemModel.countDocuments as jest.Mock).mockResolvedValue(1); // Mock total count
  });

  it("should return a list of products when calling getAllProducts", async () => {
    const result = await ProductRepository.getAllProducts({
      page: 1,
      limit: 10,
      filter: {},
      sort: { name: "asc" },
    });

    expect(result).toEqual({
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      products: [mockProduct],
    });

    // Expect all methods in the chain to have been called
    expect(ItemModel.find).toHaveBeenCalled();
    expect(ItemModel.find().sort).toHaveBeenCalledWith({ name: 1 });
    expect(ItemModel.find().skip).toHaveBeenCalledWith(0);
    expect(ItemModel.find().limit).toHaveBeenCalledWith(10);
  });
});
