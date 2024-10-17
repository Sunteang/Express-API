// // import dotenv from "dotenv";
// // import path from "path";
// // import Joi from "joi";

// // type Config = {
// //   env: string;
// //   port: number;
// //   mongodbUrl: string;
// // };

// // function loadConfig(): Config {
// //   const env = process.env.NODE_ENV || "development";
// //   const envPath = path.resolve(__dirname, `./configs/.env.${env}`);

// //   console.log(`Loading environment from: ${envPath}`);

// //   const result = dotenv.config({ path: envPath });

// //   if (result.error) {
// //     console.error(`Failed to load .env file for environment: ${env}`);
// //     throw result.error;
// //   }

// //   const envVarsSchema = Joi.object({
// //     NODE_ENV: Joi.string().required(),
// //     PORT: Joi.number().default(3000),
// //     MONGODB_URL: Joi.string().uri().required(),
// //   })
// //     .unknown()
// //     .required();

// //   const { value: envVars, error } = envVarsSchema.validate(process.env);
// //   if (error) {
// //     throw new Error(`Config validation error: ${error.message}`);
// //   }

// //   console.log("Environment variables loaded successfully:", envVars);

// //   return {
// //     env: envVars.NODE_ENV,
// //     port: envVars.PORT,
// //     mongodbUrl: envVars.MONGODB_URL,
// //   };
// // }

// // const configs = loadConfig();
// // export default configs;

// import dotenv from "dotenv";
// import path from "path";
// import Joi from "joi";

// type Config = {
//   env: string;
//   port: number;
//   mongodbUrl: string;
// };

// function loadConfig(): Config {
//   // Set default environment to 'development' if not provided
//   const env = process.env.NODE_ENV || "development";

//   // Load the appropriate .env file based on the environment
//   const envFilePath = path.resolve(__dirname, `./configs/.env.${env}`);
//   console.log(`Loading environment variables from: ${envFilePath}`);

//   // Load the .env file
//   const result = dotenv.config({ path: envFilePath });

//   // Check if the .env file was successfully loaded
//   if (result.error) {
//     console.error(
//       `Failed to load .env file for environment: ${env}. Error: ${result.error}`
//     );
//     throw result.error;
//   }

//   // Define schema for environment variables validation
//   const envVarsSchema = Joi.object({
//     NODE_ENV: Joi.string()
//       .valid("development", "test", "production", "docker")
//       .default("development")
//       .required(),
//     PORT: Joi.number().default(3000),
//     MONGODB_URL: Joi.string().uri().required(),
//   }).unknown(); // Allow unknown variables to support other custom env variables if necessary

//   // Validate the environment variables
//   const { value: envVars, error } = envVarsSchema.validate(process.env);

//   if (error) {
//     throw new Error(`Config validation error: ${error.message}`);
//   }

//   // Log environment variables for debugging purposes
//   console.log("Environment variables loaded successfully:", envVars);

//   // Return the validated configuration
//   return {
//     env: envVars.NODE_ENV,
//     port: envVars.PORT,
//     mongodbUrl: envVars.MONGODB_URL,
//   };
// }

// // Export the loaded configuration
// const configs = loadConfig();
// export default configs;

//v2
// config.ts
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  env: string;
  port: number;
  mongodbUrl: string;
  cognito: {
    userPoolId: string;
    clientId: string;
    clientSecret: string;
    region: string;
  };
  clientUrl: string;
};

function loadConfig(): Config {
  const env = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required(),
    COGNITO_USER_POOL_ID: Joi.string().required(),
    COGNITO_CLIENT_ID: Joi.string().required(),
    COGNITO_REGION: Joi.string().required(),
    COGNITO_CLIENT_SECRET: Joi.string().required(),
  })
    .unknown()
    .required();

  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
    clientUrl: "http://localhost:3000",
    cognito: {
      userPoolId: envVars.COGNITO_USER_POOL_ID,
      clientId: envVars.COGNITO_CLIENT_ID,
      clientSecret: envVars.COGNITO_CLIENT_SECRET,
      region: envVars.COGNITO_REGION,
    },
  };
}

const configs = loadConfig();
export default configs;
