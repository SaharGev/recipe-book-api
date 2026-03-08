import {
  Body,
  Controller,
  Post,
  Route,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

interface RefreshRequest {
  refreshToken: string;
}

interface LogoutRequest {
  refreshToken: string;
}

interface AuthResponse {
  _id: string;
  token: string;
  refreshToken: string;
}

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

interface MessageResponse {
  message: string;
}

@Route("auth")
@Tags("Auth")
export class AuthSwaggerController extends Controller {
  /**
   * Register a new user
   */
  @SuccessResponse("201", "Created")
  @Response<MessageResponse>("400", "Bad Request")
  @Response<MessageResponse>("409", "Conflict")
  @Post("register")
  public async register(
    @Body() _body: RegisterRequest
  ): Promise<AuthResponse> {
    return {
      _id: "string",
      token: "string",
      refreshToken: "string",
    };
  }

  /**
   * Login with email or phone and password
   */
  @SuccessResponse("200", "OK")
  @Response<MessageResponse>("400", "Bad Request")
  @Response<MessageResponse>("401", "Unauthorized")
  @Post("login")
  public async login(
    @Body() _body: LoginRequest
  ): Promise<AuthResponse> {
    return {
      _id: "string",
      token: "string",
      refreshToken: "string",
    };
  }

  /**
   * Get new access token using refresh token
   */
  @SuccessResponse("200", "OK")
  @Response<MessageResponse>("400", "Bad Request")
  @Response<MessageResponse>("401", "Unauthorized")
  @Post("refresh")
  public async refreshToken(
    @Body() _body: RefreshRequest
  ): Promise<RefreshResponse> {
    return {
      token: "string",
      refreshToken: "string",
    };
  }

  /**
   * Logout current user by refresh token
   */
  @SuccessResponse("200", "OK")
  @Response<MessageResponse>("400", "Bad Request")
  @Response<MessageResponse>("401", "Unauthorized")
  @Post("logout")
  public async logout(
    @Body() _body: LogoutRequest
  ): Promise<MessageResponse> {
    return {
      message: "Logged out successfully",
    };
  }
}