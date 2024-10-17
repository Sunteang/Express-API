// // src/database/connection.ts
// import configs from "@/src/config";
// import mongoose from "mongoose";

// async function connectToMongoDB() {
//   try {
//     const mongodbUrl =
//       process.env.MONGODB_URL || "mongodb://localhost:27017/testdb"; //new
//     const username = process.env.MONGODB_USERNAME || ""; // new
//     const password = process.env.MONGODB_PASSWORD || ""; // new

//     if (!mongodbUrl) {
//       throw new Error("MONGODB_URL environment variable is not set");
//     }

//     await mongoose.connect(mongodbUrl, {
//       user: username,
//       pass: password,
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true,
//     });
//     //await mongoose.connect(configs.mongodbUrl);
//     console.log("MongoDB is connected!!!");
//   } catch (error) {
//     console.error(`connectToMongoDB() method error: `, error);
//     throw error;
//   }
// }

// export default connectToMongoDB;

import mongoose from "mongoose";

const connectToMongoDB = async () => {
  const url =
    process.env.MONGODB_URL ||
    "mongodb+srv://sereysunteang:p4ssw0rd@cluster0.drkax.mongodb.net/ProductCatalog?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, // Adjust as needed
    });
    console.log("MongoDB is connected successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default connectToMongoDB;
