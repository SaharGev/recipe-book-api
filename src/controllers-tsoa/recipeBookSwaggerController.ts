import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";

interface CreateRecipeBookRequest {
  name: string;
  description?: string;
  isPublic: boolean;
}

interface UpdateRecipeBookRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

interface ShareRecipeBookRequest {
  userId: string;
  role?: "editor" | "viewer";
}

interface RecipeBookSwaggerResponse {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  owner?: string;
}

interface RecipeBookSwaggerMessageResponse {
  message: string;
}

@Route("recipe-books")
@Tags("Recipe Books")
export class RecipeBookSwaggerController extends Controller {
  /**
   * Create recipe book
   */
  @SuccessResponse("201", "Created")
  @Security("bearerAuth")
  @Post()
  public async createRecipeBook(
    @Body() _body: CreateRecipeBookRequest
  ): Promise<RecipeBookSwaggerResponse> {
    return {
      _id: "string",
      name: "string",
      description: "string",
      isPublic: true,
      owner: "string",
    };
  }

  /**
   * Add recipe to recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Post("{bookId}/recipes/{recipeId}")
  public async addRecipeToBook(
    @Path() bookId: string,
    @Path() recipeId: string
  ): Promise<RecipeBookSwaggerMessageResponse> {
    return { message: "Recipe added to book" };
  }

  /**
   * Remove recipe from recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Delete("{bookId}/recipes/{recipeId}")
  public async removeRecipeFromBook(
    @Path() bookId: string,
    @Path() recipeId: string
  ): Promise<RecipeBookSwaggerMessageResponse> {
    return { message: "Recipe removed from book" };
  }

  /**
   * Get all recipe books
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Get()
  public async getAllRecipeBooks(): Promise<RecipeBookSwaggerResponse[]> {
    return [];
  }

  /**
   * Get my recipe books
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Get("my")
  public async getMyRecipeBooks(): Promise<RecipeBookSwaggerResponse[]> {
    return [];
  }

  /**
   * Get recipe book by id
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Get("{bookId}")
  public async getRecipeBookById(
    @Path() bookId: string
  ): Promise<RecipeBookSwaggerResponse> {
    return {
      _id: bookId,
      name: "string",
      description: "string",
      isPublic: true,
      owner: "string",
    };
  }

  /**
   * Delete recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Delete("{bookId}")
  public async deleteRecipeBook(
    @Path() bookId: string
  ): Promise<RecipeBookSwaggerMessageResponse> {
    return { message: "Recipe book deleted successfully" };
  }

  /**
   * Share recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Post("{bookId}/share")
  public async shareRecipeBook(
    @Path() bookId: string,
    @Body() _body: ShareRecipeBookRequest
  ): Promise<RecipeBookSwaggerMessageResponse> {
    return { message: "Recipe book shared successfully" };
  }

  /**
   * Unshare recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Post("{bookId}/unshare")
  public async unshareRecipeBook(
    @Path() bookId: string,
    @Body() _body: { userId: string }
  ): Promise<RecipeBookSwaggerMessageResponse> {
    return { message: "Recipe book unshared successfully" };
  }

  /**
   * Update recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Put("{bookId}")
  public async updateRecipeBook(
    @Path() bookId: string,
    @Body() _body: UpdateRecipeBookRequest
  ): Promise<RecipeBookSwaggerResponse> {
    return {
      _id: bookId,
      name: "string",
      description: "string",
      isPublic: true,
      owner: "string",
    };
  }

  /**
   * Duplicate recipe book
   */
  @SuccessResponse("200", "OK")
  @Security("bearerAuth")
  @Post("{bookId}/duplicate")
  public async duplicateRecipeBook(
    @Path() bookId: string
  ): Promise<RecipeBookSwaggerResponse> {
    return {
      _id: "string",
      name: "string",
      description: "string",
      isPublic: true,
      owner: "string",
    };
  }
}