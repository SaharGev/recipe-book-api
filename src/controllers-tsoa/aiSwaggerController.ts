import { Body, Controller, Post, Route, Tags } from "tsoa";
import { aiSearchService } from "../services/aiService";
import { AiSearchRequest, AiSearchResponse } from "../types/aiTypes";

@Route("ai")
@Tags("AI")
export class AiSwaggerController extends Controller {

  @Post("ai-search")
  public async aiSearch(
    @Body() body: AiSearchRequest
  ): Promise<AiSearchResponse> {

    const result = await aiSearchService(body.query);
    return result;
  }
}