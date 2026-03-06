import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
  SuccessResponse,
  Response,
} from "tsoa";

interface CreateRecipeRequest {
  title: string;
  description?: string;
  ingredients: string[];
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  isPublic: boolean;
  imageUrl?: string;
}

interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  ingredients?: string[];
  cookTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  isPublic?: boolean;
  imageUrl?: string;
  collaborators?: {
    user: string;
    role?: "editor" | "viewer";
  }[];
}

interface UpdateRecipeImageRequest {
  imageUrl: string;
}

interface RecipeSwaggerResponse {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  isPublic: boolean;
  imageUrl?: string;
  owner?: string;
}

interface RecipeSwaggerMessageResponse {
  message: string;
}

@Route("recipes")
@Tags("Recipes")
export class RecipeSwaggerController extends Controller {
  /**
   * Create a new recipe
   */
  @SuccessResponse("201", "Created")
  @Response<RecipeSwaggerMessageResponse>("400", "Bad Request")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Post()
  public async createNewRecipe(
    @Body() _body: CreateRecipeRequest
  ): Promise<RecipeSwaggerResponse> {
    return {
      _id: "string",
      title: "string",
      description: "string",
      ingredients: ["string"],
      cookTime: 30,
      difficulty: "easy",
      isPublic: true,
      imageUrl: "string",
      owner: "string",
    };
  }

  /**
   * Get all recipes visible to current user
   */
  @SuccessResponse("200", "OK")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Get()
  public async getAllRecipes(): Promise<RecipeSwaggerResponse[]> {
    return [];
  }

  /**
   * Get current user's recipes
   */
  @SuccessResponse("200", "OK")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Get("my")
  public async getMyRecipes(): Promise<RecipeSwaggerResponse[]> {
    return [];
  }

  /**
   * Get recipe by id
   */
  @SuccessResponse("200", "OK")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Response<RecipeSwaggerMessageResponse>("403", "Forbidden")
  @Response<RecipeSwaggerMessageResponse>("404", "Recipe not found")
  @Security("bearerAuth")
  @Get("{id}")
  public async getRecipeById(
    @Path() id: string
  ): Promise<RecipeSwaggerResponse> {
    return {
      _id: id,
      title: "string",
      description: "string",
      ingredients: ["string"],
      cookTime: 30,
      difficulty: "easy",
      isPublic: true,
      imageUrl: "string",
      owner: "string",
    };
  }

  /**
   * Update recipe
   */
  @SuccessResponse("200", "OK")
  @Response<RecipeSwaggerMessageResponse>("400", "Bad Request")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Response<RecipeSwaggerMessageResponse>("403", "Forbidden")
  @Response<RecipeSwaggerMessageResponse>("404", "Recipe not found")
  @Security("bearerAuth")
  @Put("{id}")
  public async updateRecipe(
    @Path() id: string,
    @Body() _body: UpdateRecipeRequest
  ): Promise<RecipeSwaggerResponse> {
    return {
      _id: id,
      title: "string",
      description: "string",
      ingredients: ["string"],
      cookTime: 30,
      difficulty: "easy",
      isPublic: true,
      imageUrl: "string",
      owner: "string",
    };
  }

  /**
   * Delete recipe
   */
  @SuccessResponse("200", "OK")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Response<RecipeSwaggerMessageResponse>("403", "Forbidden")
  @Response<RecipeSwaggerMessageResponse>("404", "Recipe not found")
  @Security("bearerAuth")
  @Delete("{id}")
  public async deleteRecipe(
    @Path() id: string
  ): Promise<RecipeSwaggerMessageResponse> {
    return {
      message: "Recipe deleted successfully",
    };
  }

  /**
   * Update recipe image
   */
  @SuccessResponse("200", "OK")
  @Response<RecipeSwaggerMessageResponse>("400", "Bad Request")
  @Response<RecipeSwaggerMessageResponse>("401", "Unauthorized")
  @Response<RecipeSwaggerMessageResponse>("403", "Forbidden")
  @Response<RecipeSwaggerMessageResponse>("404", "Recipe not found")
  @Security("bearerAuth")
  @Patch("{id}/image")
  public async updateRecipeImage(
    @Path() id: string,
    @Body() _body: UpdateRecipeImageRequest
  ): Promise<RecipeSwaggerResponse> {
    return {
      _id: id,
      title: "string",
      description: "string",
      ingredients: ["string"],
      cookTime: 30,
      difficulty: "easy",
      isPublic: true,
      imageUrl: "string",
      owner: "string",
    };
  }
}