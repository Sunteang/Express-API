// import { AuthRepository } from "../database/repositories/auth.repository";
// import { createHmac } from "crypto";
// import {
//   SignUpCommandInput,
//   SignUpCommandOutput,
//   InitiateAuthCommandInput,
//   InitiateAuthCommandOutput,
//   ConfirmSignUpCommandInput,
//   ConfirmSignUpCommandOutput,
// } from "@aws-sdk/client-cognito-identity-provider";

// // Define the structure of the expected Google token response
// interface GoogleTokensResponse {
//   access_token: string;
//   expires_in: number;
//   refresh_token?: string;
//   scope: string;
//   token_type: string;
//   id_token: string;
// }

// export class AuthService {
//   private authRepository: AuthRepository;

//   constructor() {
//     this.authRepository = new AuthRepository();
//   }

//   // Helper to get environment variables safely
//   private getEnvVar(key: string): string {
//     const value = process.env[key];
//     if (!value) {
//       throw new Error(`Environment variable ${key} is not set`);
//     }
//     return value;
//   }

//   // Function to calculate SECRET_HASH for Cognito
//   private calculateSecretHash(email: string): string {
//     const clientSecret = this.getEnvVar("COGNITO_CLIENT_SECRET");
//     const clientId = this.getEnvVar("COGNITO_CLIENT_ID");

//     return createHmac("sha256", clientSecret)
//       .update(email + clientId)
//       .digest("base64");
//   }

//   // Handle sign-up logic with error handling
//   public async signUp(
//     email: string,
//     password: string,
//     phone_number?: string
//   ): Promise<SignUpCommandOutput> {
//     try {
//       const userAttributes = [{ Name: "email", Value: email }];
//       if (phone_number) {
//         userAttributes.push({ Name: "phone_number", Value: phone_number });
//       }

//       const params: SignUpCommandInput = {
//         ClientId: this.getEnvVar("COGNITO_CLIENT_ID"),
//         Username: email,
//         Password: password,
//         UserAttributes: userAttributes,
//         SecretHash: this.calculateSecretHash(email),
//       };

//       const response: SignUpCommandOutput = await this.authRepository.signUp(
//         params
//       );
//       return response;
//     } catch (error) {
//       console.error("Error during sign-up:", error);
//       throw error;
//     }
//   }

//   // Handle sign-in logic with error handling
//   public async signIn(
//     email: string,
//     password: string
//   ): Promise<InitiateAuthCommandOutput> {
//     try {
//       const params: InitiateAuthCommandInput = {
//         AuthFlow: "USER_PASSWORD_AUTH",
//         ClientId: this.getEnvVar("COGNITO_CLIENT_ID"),
//         AuthParameters: {
//           USERNAME: email,
//           PASSWORD: password,
//           SECRET_HASH: this.calculateSecretHash(email),
//         },
//       };

//       const response: InitiateAuthCommandOutput =
//         await this.authRepository.signIn(params);
//       return response;
//     } catch (error) {
//       console.error("Error during sign-in:", error);
//       throw error;
//     }
//   }

//   // Handle confirmation logic with error handling
//   public async confirmSignUp(
//     email: string,
//     confirmationCode: string
//   ): Promise<ConfirmSignUpCommandOutput> {
//     try {
//       const params: ConfirmSignUpCommandInput = {
//         ClientId: this.getEnvVar("COGNITO_CLIENT_ID"),
//         Username: email,
//         ConfirmationCode: confirmationCode,
//         SecretHash: this.calculateSecretHash(email),
//       };

//       const response: ConfirmSignUpCommandOutput =
//         await this.authRepository.confirmSignUp(params);
//       return response;
//     } catch (error) {
//       console.error("Error during confirmation of sign-up:", error);
//       throw error;
//     }
//   }

//   // Dynamic import for fetch in case it's needed
//   private async fetchUrl(url: string, options: any) {
//     const fetch = (await import("node-fetch")).default;
//     return fetch(url, options);
//   }

//   // Generate Google Sign-In URL
//   public getGoogleOAuthUrl(redirectUri: string): string {
//     const finalRedirectUri =
//       redirectUri || this.getEnvVar("GOOGLE_REDIRECT_URI");

//     const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=${encodeURIComponent(
//       "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
//     )}&response_type=code&client_id=${this.getEnvVar(
//       "GOOGLE_CLIENT_ID"
//     )}&redirect_uri=${encodeURIComponent(finalRedirectUri)}`;

//     return googleAuthUrl;
//   }

//   // Exchange authorization code for tokens
//   public async exchangeGoogleCodeForTokens(
//     code: string,
//     redirectUri: string
//   ): Promise<GoogleTokensResponse> {
//     const tokenUrl = `https://oauth2.googleapis.com/token`;

//     try {
//       const response = await this.fetchUrl(tokenUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           code,
//           client_id: this.getEnvVar("GOOGLE_CLIENT_ID"),
//           client_secret: this.getEnvVar("GOOGLE_CLIENT_SECRET"),
//           redirect_uri: redirectUri || this.getEnvVar("GOOGLE_REDIRECT_URI"),
//           grant_type: "authorization_code",
//         }).toString(),
//       });

//       if (!response.ok) {
//         const errorDetails = await response.text();
//         console.error(`Google token exchange failed: ${errorDetails}`);
//         throw new Error(`Failed to exchange code. Status: ${response.status}`);
//       }

//       const tokens = (await response.json()) as GoogleTokensResponse;
//       return tokens;
//     } catch (error) {
//       console.error("Error exchanging code for tokens:", error);
//       throw new Error("Failed to exchange authorization code for tokens.");
//     }
//   }
// }

//V2
// auth.service.ts
import {
  createAuthRequest,
  verifyAuthRequest,
  signInAuthRequest,
} from "../controllers/types/auth/auth-reques.type";
import { AuthSessionResponse } from "../controllers/types/auth/auth-response.type";
import AuthRepository from "../database/repositories/auth.repository";
import axios from "axios";
import crypto from "crypto";

export class AuthService {
  private awsCognitoDomain = process.env.COGNITO_DOMAIN!;
  private awsCognitoClientId = process.env.COGNITO_CLIENT_ID!;
  private awsRedirectUri = process.env.COGNITO_REDIRECT_URI!;
  private awsCognitoClientSecret = process.env.COGNITO_CLIENT_SECRET!;

  /**
   * Generate a random state string for OAuth 2.0 CSRF protection.
   * @returns A randomly generated state string.
   */
  public generateState(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  /**
   * Generate Cognito OAuth2 URL for Google login
   * @param state A unique state string to prevent CSRF attacks
   */
  public loginWithGoogle(): string {
    // If state is not provided, generate a random state value
    const stateValue = crypto.randomBytes(16).toString("hex");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.awsCognitoClientId,
      redirect_uri: this.awsRedirectUri,
      identity_provider: "Google",
      scope: "profile email openid",
      state: stateValue,
      prompt: "select_account",
    });

    return `${this.awsCognitoDomain}/oauth2/authorize?${params.toString()}`;
  }

  public async handleCallback(code: string, state?: string): Promise<any> {
    const tokenUrl = `${this.awsCognitoDomain}/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.awsCognitoClientId,
      redirect_uri: this.awsRedirectUri,
      code: code,
    });

    if (state) {
      params.append("state", state);
    }

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${this.awsCognitoClientId}:${this.awsCognitoClientSecret}`
      ).toString("base64")}`,
    };

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "AuthService - handleCallback(): Failed to get tokens from Cognito",
        error
      );
      throw error;
    }
  }

  public async getAllUsers(page: number = 1, limit: number = 10) {
    try {
      return await AuthRepository.getAllUsers(page, limit);
    } catch (error) {
      console.error(`AuthService - getAllUsers() method error: ${error}`);
      throw error;
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const user = await AuthRepository.getUserByEmail(email);
      if (!user) {
        throw new Error(
          "AuthService - getUserByEmail() method : User not found"
        );
      }
      return user;
    } catch (error) {
      console.error(`AuthService - getUserByEmail() method error: ${error}`);
      throw error;
    }
  }

  public async register(createAuthRequest: createAuthRequest): Promise<void> {
    try {
      console.log(
        `AuthService - register() called for ${createAuthRequest.email}`
      );
      await AuthRepository.register(createAuthRequest);
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        console.log(
          `AuthService - register() - User already exists: ${createAuthRequest.email}`
        );
        throw new Error("User already exists");
      }
      console.error(`AuthService - register() method error: ${error}`);
      throw error;
    }
  }

  public async verify(verifyRequest: verifyAuthRequest): Promise<void> {
    try {
      console.log(
        `AuthService - verify() called for ${verifyRequest.email} with code ${verifyRequest.verificationCode}`
      );
      await AuthRepository.verify(verifyRequest);

      console.log(
        `AuthService - verification successful for ${verifyRequest.email}`
      );
    } catch (error: any) {
      if (error.__type === "ExpiredCodeException") {
        console.error(
          `AuthService - verify() method error: Verification code expired for : ${verifyRequest.email}`
        );
        throw new Error(
          "Verification code expired. Please request a new code."
        );
      }
      console.error(`AuthService - verify() method error: ${error}`);
      throw error;
    }
  }

  private async storeUserInDatabase(email: string): Promise<void> {
    try {
      const userAttributes = await AuthRepository.getUserAttributes(email);
      const cognitoId = userAttributes.find(
        (attr) => attr.Name === "sub"
      )?.Value;

      if (!cognitoId) {
        throw new Error(
          `AuthService - storeUserInDatabase() method : Cognito ID not found : ${cognitoId}`
        );
      }

      await AuthRepository.storeUser(email, cognitoId);
    } catch (error) {
      console.error(
        "AuthService - storeUserInDatabase() method Error storing user in database ",
        error
      );
      throw error;
    }
  }

  public async signIn(
    signInRequest: signInAuthRequest
  ): Promise<AuthSessionResponse> {
    try {
      const authResult = await AuthRepository.signIn(signInRequest);
      console.log(`AuthService - signIn() called for : ${authResult}`);
      await this.storeUserInDatabase(signInRequest.email);

      return {
        message: "User signed in successfully!",
        data: {
          email: signInRequest.email,
          accessToken: authResult.AccessToken,
          RefreshToken: authResult.RefreshToken,
          IdToken: authResult.IdToken,
        },
      };
    } catch (error) {
      console.error(`AuthService - signIn() method error: ${error}`);
      throw error;
    }
  }
}

export default new AuthService();
