"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
// Function to load and validate environment variables
function loadConfig() {
    // Determine the environment and set the appropriate .env file
    const env = process.env.NODE_ENV || "development";
    const envPath = path_1.default.resolve(__dirname, `./configs/.env.${env}`); //dirname = corrent location of file
    console.log(`Loading environment from: ${envPath}`);
    const result = dotenv_1.default.config({ path: envPath });
    // Check if the .env file was successfully loaded
    if (result.error) {
        console.error(`Failed to load .env file for environment: ${env}`);
        throw result.error;
    }
    // Define a schema for the environment variables
    const envVarsSchema = joi_1.default.object({
        NODE_ENV: joi_1.default.string().required(),
        PORT: joi_1.default.number().default(3000),
        MONGODB_URL: joi_1.default.string().uri().required(),
    })
        .unknown()
        .required();
    // Validate the environment variables
    const { value: envVars, error } = envVarsSchema.validate(process.env);
    if (error) {
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
exports.default = configs;
//# sourceMappingURL=config.js.map