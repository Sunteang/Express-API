// import {
//   Controller,
//   Route,
//   Tags,
//   Get,
//   Post,
//   Body,
//   Query,
//   Res,
//   TsoaResponse,
// } from "tsoa";
// import { AuthService } from "../services/auth.service";
// import { SignUpCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

// // Define custom response types for each status code
// type ErrorResponse = { message: string };

// interface SignUpRequest {
//   email: string;
//   password: string;
//   phone_number?: string;
// }

// interface SignInRequest {
//   email: string;
//   password: string;
// }

// interface ConfirmSignUpRequest {
//   email: string;
//   confirmationCode: string;
// }

// interface ExchangeCodeRequest {
//   code: string;
//   redirectUri: string;
// }

// @Route("v1/auth")
// @Tags("Auth")
// export class AuthController extends Controller {
//   private authService: AuthService;

//   constructor() {
//     super();
//     this.authService = new AuthService();
//   }

//   @Post("signup")
//   public async signUp(
//     @Body() requestBody: SignUpRequest,
//     @Res() successResponse: TsoaResponse<200, SignUpCommandOutput>,
//     @Res() errorResponse: TsoaResponse<400, ErrorResponse>
//   ) {
//     try {
//       const response: SignUpCommandOutput = await this.authService.signUp(
//         requestBody.email,
//         requestBody.password,
//         requestBody.phone_number
//       );
//       return successResponse(200, response);
//     } catch (error: any) {
//       console.error("Error during sign-up:", error);
//       return errorResponse(400, { message: error.message });
//     }
//   }

//   @Post("signin")
//   public async signIn(
//     @Body() requestBody: SignInRequest,
//     @Res() successResponse: TsoaResponse<200, any>,
//     @Res() errorResponse: TsoaResponse<401, ErrorResponse>
//   ) {
//     try {
//       const response = await this.authService.signIn(
//         requestBody.email,
//         requestBody.password
//       );
//       return successResponse(200, response);
//     } catch (error: any) {
//       console.error("Error during sign-in:", error);
//       return errorResponse(401, { message: error.message });
//     }
//   }

//   @Post("confirm-signup")
//   public async confirmSignUp(
//     @Body() requestBody: ConfirmSignUpRequest,
//     @Res() successResponse: TsoaResponse<200, any>,
//     @Res() errorResponse: TsoaResponse<400, ErrorResponse>
//   ) {
//     try {
//       const response = await this.authService.confirmSignUp(
//         requestBody.email,
//         requestBody.confirmationCode
//       );
//       return successResponse(200, response);
//     } catch (error: any) {
//       console.error("Error during confirmation of sign-up:", error);
//       return errorResponse(400, { message: error.message });
//     }
//   }

//   @Get("google/url")
//   public async getGoogleSignInUrl(
//     @Query() redirectUri: string,
//     @Res() successResponse: TsoaResponse<200, { googleAuthUrl: string }>,
//     @Res() errorResponse: TsoaResponse<400, ErrorResponse>
//   ) {
//     try {
//       if (!redirectUri) {
//         return errorResponse(400, { message: "redirectUri is required" });
//       }

//       console.log("Received redirectUri for Google URL:", redirectUri);

//       const googleAuthUrl = this.authService.getGoogleOAuthUrl(redirectUri);
//       return successResponse(200, { googleAuthUrl });
//     } catch (error: any) {
//       console.error("Error generating Google sign-in URL:", error);
//       return errorResponse(400, { message: error.message });
//     }
//   }

//   @Get("google/callback")
//   public async handleGoogleCallback(
//     @Query() code: string,
//     @Query() redirectUri: string,
//     @Res()
//     successResponse: TsoaResponse<
//       200,
//       { access_token: string; id_token: string }
//     >,
//     @Res() errorResponse: TsoaResponse<400, ErrorResponse>
//   ) {
//     try {
//       if (!code) {
//         return errorResponse(400, { message: "Authorization code is missing" });
//       }

//       if (!redirectUri) {
//         return errorResponse(400, { message: "redirectUri is required" });
//       }

//       console.log("Received code:", code);
//       console.log("Received redirectUri:", redirectUri);

//       const tokens = await this.authService.exchangeGoogleCodeForTokens(
//         code,
//         redirectUri
//       );

//       return successResponse(200, {
//         access_token: tokens.access_token,
//         id_token: tokens.id_token,
//       });
//     } catch (error: any) {
//       console.error("Error exchanging code for tokens:", error);
//       return errorResponse(400, { message: error.message });
//     }
//   }
// }

//V2
// auth.controller.ts
import {
  createAuthRequest,
  verifyAuthRequest,
  signInAuthRequest,
} from "../controllers/types/auth/auth-reques.type";
import { AuthResponse } from "./types/auth/auth-response.type";
import {
  UserResponse,
  UsersResponse,
} from "../controllers/types/user/user-response.type";
import AuthService from "../services/auth.service";
import { AuthRepository } from "../database/repositories/auth.repository";
import { UserAttributesResponse } from "./types/user/user-response.type";
import { sendResponse } from "../utils/sendResponse";
import setCookie from "../utils/cookie";
import {
  Controller,
  Tags,
  Route,
  Post,
  Get,
  Body,
  Path,
  Query,
  Request,
} from "tsoa";
import express from "express";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private authRepository: AuthRepository;
  constructor() {
    super();
    this.authRepository = new AuthRepository();
  }

  @Post("/register")
  public async register(
    @Body() createAuthRequest: createAuthRequest
  ): Promise<AuthResponse> {
    try {
      await AuthService.register(createAuthRequest);
      return {
        message: "User registered successfully!",
        data: {
          email: createAuthRequest.email,
        },
      };
    } catch (error: any) {
      console.error(`AuthController - register() method error: ${error}`);
      if (error.message === "User already exists") {
        this.setStatus(409);
        throw new Error("User with this email already exists");
      } else {
        this.setStatus(500);
        throw new Error("An error occurred during registration");
      }
    }
  }

  @Post("/verify")
  public async verify(
    @Body() requestBody: verifyAuthRequest
  ): Promise<AuthResponse> {
    try {
      await AuthService.verify(requestBody);
      return {
        message: "User verified successfully!",
        data: null,
      };
    } catch (error) {
      console.error(`AuthController - verify() method error: ${error}`);
      throw error;
    }
  }

  @Post("/signin")
  public async signIn(
    @Body() requestBody: signInAuthRequest
  ): Promise<AuthResponse> {
    try {
      const result = await AuthService.signIn(requestBody);
      return {
        message: "User signed in successfully!",
        data: {
          email: result.data.email,
          AccessToken: result.data.accessToken,
          RefreshToken: result.data.RefreshToken,
          IdToken: result.data.IdToken,
        },
      };
    } catch (error) {
      console.error(`AuthController - signIn() method error : ${error}`);
      throw error;
    }
  }

  /**
   * Login with Google using Cognito OAuth2
   * @param state A unique state string to prevent CSRF attacks
   */
  @Get("/google/login")
  public loginWithGoogle() {
    const cognitoOAuthURL = AuthService.loginWithGoogle();
    return sendResponse({
      message: "Login with Google successfully",
      data: cognitoOAuthURL,
    });
  }

  @Get("google/callback")
  public async cognitoCallback(@Request() request: express.Request) {
    try {
      const code = request.query.code as string;
      const state = request.query.state as string;

      if (!code) {
        console.error(
          "AuthController - cognitoCallback(): No code provided in query parameters"
        );
        return sendResponse({
          status: 400,
          message: "No authorization code provided",
          data: null,
        });
      }

      const response = (request as any).res as express.Response;
      const tokens = await AuthService.handleCallback(code, state);

      // Set cookies
      setCookie(response, "id_token", tokens.id_token);
      setCookie(response, "access_token", tokens.access_token);
      setCookie(response, "refresh_token", tokens.refresh_token);

      return sendResponse({
        status: 200,
        message: "Authentication successful",
        data: null,
      });
    } catch (error) {
      console.error(
        "AuthController - cognitoCallback(): Authentication failed",
        error
      );
      return sendResponse({
        status: 500,
        message: "Authentication failed",
        data: null,
      });
    }
  }

  @Get("/user/{email}/attributes")
  public async getUserAttributes(
    @Path() email: string
  ): Promise<UserAttributesResponse> {
    try {
      const attributes = await this.authRepository.getUserAttributes(email);
      return {
        message: "User attributes retrieved successfully!",
        data: { attributes },
      };
    } catch (error) {
      console.error(
        `AuthController - getUserAttributes() method error: ${error}`
      );
      throw error;
    }
  }

  @Get("/user/{email}")
  public async getUserByEmail(@Path() email: string): Promise<UserResponse> {
    try {
      const user = await this.authRepository.getUserByEmail(email);
      if (user) {
        return {
          message: "User retrieved successfully!",
          data: user,
        };
      } else {
        this.setStatus(404);
        return {
          message: "User not found",
          data: null,
        };
      }
    } catch (error) {
      console.error(`AuthController - getUserByEmail() method error: ${error}`);
      throw error;
    }
  }

  @Get("/users")
  public async getAllUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<UsersResponse> {
    try {
      const result = await this.authRepository.getAllUsers(page, limit);
      return {
        message: "Users retrieved successfully!",
        data: result,
      };
    } catch (error) {
      console.error(`AuthController - getAllUsers() method error: ${error}`);
      throw error;
    }
  }
}

export default new AuthController();
