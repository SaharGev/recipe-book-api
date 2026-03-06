import {
  Body,
  Controller,
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