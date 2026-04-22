import { Body, Controller, Post, Request, Response, Route, Security, Tags } from "tsoa";
import { aiSearchService } from "../services/aiService";
import { AiSearchRequest, AiSearchResponse } from "../types/aiTypes";

@Route("ai")
@Tags("AI")
export class AiSwaggerController extends Controller {

  @Post("ai-search")
  @Security("bearerAuth")
  @Response<{ message: string }>(401, "Unauthorized")
  @Response<{ message: string }>(500, "Failed to perform AI search")
  public async aiSearch(
    @Request() req: Express.Request & { user?: { _id: string } },
    @Body() body: AiSearchRequest
  ): Promise<AiSearchResponse> {

    const result = await aiSearchService(body.query, req.user!._id.toString());
    return result;
  }
}