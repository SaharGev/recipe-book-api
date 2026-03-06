import {
  Controller,
  Post,
  Route,
  Tags,
  Security,
  UploadedFile,
  SuccessResponse,
  Response,
} from "tsoa";

interface UploadSwaggerResponse {
  url: string;
}

interface UploadSwaggerMessageResponse {
  message: string;
}

@Route("upload")
@Tags("Upload")
export class UploadSwaggerController extends Controller {
  /**
   * Upload image file
   */
  @SuccessResponse("201", "Created")
  @Response<UploadSwaggerMessageResponse>("400", "Bad Request")
  @Response<UploadSwaggerMessageResponse>("401", "Unauthorized")
  @Security("bearerAuth")
  @Post("image")
  public async uploadImage(
    @UploadedFile() _image: Express.Multer.File
  ): Promise<UploadSwaggerResponse> {
    return {
      url: "/uploads/example.png",
    };
  }
}