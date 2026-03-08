import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";

interface CreateCommentRequest {
  targetType: "recipe" | "recipeBook";
  targetId: string;
  content: string;
}

interface UpdateCommentRequest {
  content: string;
}

interface CommentSwaggerResponse {
  _id: string;
  targetType: "recipe" | "recipeBook";
  targetId: string;
  content: string;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CommentSwaggerMessageResponse {
  message: string;
}

@Route("comments")
@Tags("Comments")
export class CommentSwaggerController extends Controller {
  /**
   * Create a comment
   */
  @SuccessResponse("201", "Created")
  @Response<CommentSwaggerMessageResponse>("400", "Bad Request")
  @Response<CommentSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Post()
  public async create(
    @Body() _body: CreateCommentRequest
  ): Promise<CommentSwaggerResponse> {
    return {
      _id: "string",
      targetType: "recipe",
      targetId: "string",
      content: "string",
      owner: "string",
    };
  }

  /**
   * Get comments by target
   */
  @SuccessResponse("200", "OK")
  @Response<CommentSwaggerMessageResponse>("400", "Bad Request")
  @Get()
  public async getByTarget(
    @Query() targetType: "recipe" | "recipeBook",
    @Query() targetId: string
  ): Promise<CommentSwaggerResponse[]> {
    return [];
  }

  /**
   * Update comment
   */
  @SuccessResponse("200", "OK")
  @Response<CommentSwaggerMessageResponse>("400", "Bad Request")
  @Response<CommentSwaggerMessageResponse>("401", "Unauthorized")
  @Response<CommentSwaggerMessageResponse>("403", "Forbidden")
  @Response<CommentSwaggerMessageResponse>("404", "Comment not found")
  @Security("bearerAuth")
  @Put("{id}")
  public async update(
    @Path() id: string,
    @Body() _body: UpdateCommentRequest
  ): Promise<CommentSwaggerResponse> {
    return {
      _id: id,
      targetType: "recipe",
      targetId: "string",
      content: "string",
      owner: "string",
    };
  }

  /**
   * Delete comment
   */
  @SuccessResponse("200", "OK")
  @Response<CommentSwaggerMessageResponse>("401", "Unauthorized")
  @Response<CommentSwaggerMessageResponse>("403", "Forbidden")
  @Response<CommentSwaggerMessageResponse>("404", "Comment not found")
  @Security("bearerAuth")
  @Delete("{id}")
  public async deleteComment(
    @Path() id: string
  ): Promise<CommentSwaggerMessageResponse> {
    return {
      message: "Comment deleted successfully",
    };
  }
}