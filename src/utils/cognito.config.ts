// src/configs/cognito.config.ts
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

// Create a Cognito client instance
export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION, // Ensure this matches your Cognito User Pool region
});

import dotenv from "dotenv";

// Load the environment variables from the .env.development file
dotenv.config({ path: "./src/configs/.env.development" });
