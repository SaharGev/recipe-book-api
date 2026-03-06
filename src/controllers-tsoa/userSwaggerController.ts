import {
  Body,
  Controller,
  Get,
  Patch,
  Route,
  Security,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";

interface UpdateProfileImageRequest {
  profileImageUrl: string;
}

interface UpdateCurrentUserRequest {
  username?: string;
  email?: string;
  phone?: string;
}

interface UserSwaggerResponse {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
}

interface UserSwaggerMessageResponse {
  message: string;
}

@Route("users")
@Tags("Users")
export class UserSwaggerController extends Controller {
  /**
   * Get current logged-in user
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Response<UserSwaggerMessageResponse>("404", "User not found")
  @Security("bearerAuth")
  @Get("me")
  public async getCurrentUser(): Promise<UserSwaggerResponse> {
    return {
      _id: "string",
      username: "string",
      email: "string",
      phone: "string",
      profileImageUrl: "string",
    };
  }

  /**
   * Update current logged-in user
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("400", "Bad Request")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Response<UserSwaggerMessageResponse>("404", "User not found")
  @Response<UserSwaggerMessageResponse>("409", "Conflict")
  @Security("bearerAuth")
  @Patch("me")
  public async updateCurrentUser(
    @Body() _body: UpdateCurrentUserRequest
  ): Promise<UserSwaggerResponse> {
    return {
      _id: "string",
      username: "string",
      email: "string",
      phone: "string",
      profileImageUrl: "string",
    };
  }

  /**
   * Update profile image of current logged-in user
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("400", "Bad Request")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Response<UserSwaggerMessageResponse>("404", "User not found")
  @Security("bearerAuth")
  @Patch("profile-image")
  public async updateProfileImage(
    @Body() _body: UpdateProfileImageRequest
  ): Promise<UserSwaggerResponse> {
    return {
      _id: "string",
      username: "string",
      email: "string",
      phone: "string",
      profileImageUrl: "string",
    };
  }
}