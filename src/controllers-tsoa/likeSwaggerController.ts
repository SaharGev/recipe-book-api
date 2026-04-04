import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Security,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";

interface LikeRequest {
  targetType: "recipe" | "recipeBook";
  targetId: string;
}

interface LikeSwaggerResponse {
  message: string;
}

@Route("likes")
@Tags("Likes")
export class LikeSwaggerController extends Controller {
  /**
   * Get all likes of the current user
   */
  @SuccessResponse("200", "OK")
  @Response<LikeSwaggerResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Get()
  public async getMyLikes(): Promise<LikeSwaggerResponse> {
    return {
      message: "List of likes",
    };
  }
  
  /**
   * Like or unlike a target (recipe or recipe book)
   */
  @SuccessResponse("200", "OK")
  @Response<LikeSwaggerResponse>("400", "Bad Request")
  @Response<LikeSwaggerResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Post()
  public async like(
    @Body() _body: LikeRequest
  ): Promise<LikeSwaggerResponse> {
    return {
      message: "Like toggled successfully",
    };
  }
}