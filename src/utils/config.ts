// import dotenv from "dotenv";
// import path from "path";
// import Joi from "joi";

// type Config = {
//   env: string;
//   port: number;
//   mongodbUrl: string;
// };

// // Function to load and validate environment variables
// function loadConfig(): Config {
//   // Determine the environment and set the appropriate .env file
//   const env = process.env.NODE_ENV || "development";
//   const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
//   dotenv.config({ path: envPath });

//   // Define a schema for the environment variables
//   const envVarsSchema = Joi.object({
//     NODE_ENV: Joi.string().required(),
//     PORT: Joi.number().default(3000),
//     MONGODB_URL: Joi.string().required(),
//   })
//     .unknown()
//     .required();

//   // Validate the environment variables
//   const { value: envVars, error } = envVarsSchema.validate(process.env);
//   if (error) {
//     throw new Error(`Config validation error: ${error.message}`);
//   }

//   return {
//     env: envVars.NODE_ENV,
//     port: envVars.PORT,
//     mongodbUrl: envVars.MONGODB_URL,
//   };
// }

// // Export the loaded configuration
// const configs = loadConfig();
// export default configs;

import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  env: string;
  port: number;
  mongodbUrl: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || "development";

  // Set the correct path for development and production .env files
  const envPath =
    env === "production"
      ? path.resolve(__dirname, `../../build/configs/.env.production`) // For production build
      : path.resolve(__dirname, `../configs/.env.development`); // For development environment

  console.log(`Loading environment from: ${envPath}`);

  // Load the environment variables from the .env file
  const dotenvResult = dotenv.config({ path: envPath });

  // Check if the .env file was successfully loaded
  if (dotenvResult.error) {
    console.error(`Failed to load environment file: ${dotenvResult.error}`);
  } else {
    console.log("Environment variables loaded:", dotenvResult.parsed);
  }

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid("development", "production", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("MongoDB connection URL"),
  }).unknown();

  // Validate the environment variables
  const { value: envVars, error } = envVarsSchema.validate(process.env);

  if (error) {
    console.error("Environment variables:", process.env); // Log all env variables for debugging
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;
