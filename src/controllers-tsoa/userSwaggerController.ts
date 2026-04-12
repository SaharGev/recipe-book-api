import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Patch,
  Post,
  Query,
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

interface FriendSwaggerResponse {
  _id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
}

interface AddFriendRequest {
  identifier: string;
}

interface SearchUsersResponse {
  users: FriendSwaggerResponse[];
}

interface FriendsListResponse {
  friends: FriendSwaggerResponse[];
}

interface RecentlyViewedRecipeSwaggerItem {
  _id: string;
  title: string;
}

interface RecentlyViewedBookSwaggerItem {
  _id: string;
  name: string;
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
   * Get recently viewed recipes and recipe books of current user
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Get("me/recently-viewed")
  public async getRecentlyViewed(): Promise<{
    recentlyViewedRecipes: RecentlyViewedRecipeSwaggerItem[];
    recentlyViewedBooks: RecentlyViewedBookSwaggerItem[];
  }> {
    return {
      recentlyViewedRecipes: [],
      recentlyViewedBooks: [],
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

  /**
   * Get friends list of current user
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Get("friends")
  public async getFriends(): Promise<FriendsListResponse> {
    return { friends: [] };
  }

  /**
   * Add a friend by email, username or phone
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("400", "Bad Request")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Response<UserSwaggerMessageResponse>("404", "User not found")
  @Security("bearerAuth")
  @Post("friends")
  public async addFriend(
    @Body() _body: AddFriendRequest
  ): Promise<{ message: string; friend: FriendSwaggerResponse }> {
    return { message: "string", friend: { _id: "string", username: "string", email: "string" } };
  }

  /**
   * Remove a friend
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("400", "Bad Request")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Delete("friends/{friendId}")
  public async removeFriend(
    @Path() friendId: string
  ): Promise<UserSwaggerMessageResponse> {
    return { message: "string" };
  }

  /**
   * Search users by username, email or phone
   */
  @SuccessResponse("200", "OK")
  @Response<UserSwaggerMessageResponse>("400", "Bad Request")
  @Response<UserSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Get("search")
  public async searchUsers(
    @Query() query: string
  ): Promise<SearchUsersResponse> {
    return { users: [] };
  }
}