/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserSwaggerController } from './controllers-tsoa/userSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UploadSwaggerController } from './controllers-tsoa/uploadSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RecipeSwaggerController } from './controllers-tsoa/recipeSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RecipeBookSwaggerController } from './controllers-tsoa/recipeBookSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LikeSwaggerController } from './controllers-tsoa/likeSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CommentSwaggerController } from './controllers-tsoa/commentSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthSwaggerController } from './controllers-tsoa/authSwaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AiSwaggerController } from './controllers-tsoa/aiSwaggerController';
import { expressAuthentication } from './middlewares/tsoaAuthentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "UserSwaggerResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
            "profileImageUrl": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserSwaggerMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCurrentUserRequest": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phone": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProfileImageRequest": {
        "dataType": "refObject",
        "properties": {
            "profileImageUrl": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadSwaggerResponse": {
        "dataType": "refObject",
        "properties": {
            "url": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadSwaggerMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeSwaggerResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "ingredients": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "cookTime": {"dataType":"double","required":true},
            "difficulty": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["easy"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["hard"]}],"required":true},
            "isPublic": {"dataType":"boolean","required":true},
            "imageUrl": {"dataType":"string"},
            "owner": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeSwaggerMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRecipeRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "ingredients": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "cookTime": {"dataType":"double","required":true},
            "difficulty": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["easy"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["hard"]}],"required":true},
            "isPublic": {"dataType":"boolean","required":true},
            "imageUrl": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRecipeRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "description": {"dataType":"string"},
            "ingredients": {"dataType":"array","array":{"dataType":"string"}},
            "cookTime": {"dataType":"double"},
            "difficulty": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["easy"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["hard"]}]},
            "isPublic": {"dataType":"boolean"},
            "imageUrl": {"dataType":"string"},
            "collaborators": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"role":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["editor"]},{"dataType":"enum","enums":["viewer"]}]},"user":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRecipeImageRequest": {
        "dataType": "refObject",
        "properties": {
            "imageUrl": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeBookSwaggerResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "isPublic": {"dataType":"boolean","required":true},
            "owner": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRecipeBookRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "isPublic": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecipeBookSwaggerMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ShareRecipeBookRequest": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "role": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["editor"]},{"dataType":"enum","enums":["viewer"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRecipeBookRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "description": {"dataType":"string"},
            "isPublic": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LikeSwaggerResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LikeRequest": {
        "dataType": "refObject",
        "properties": {
            "targetType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["recipe"]},{"dataType":"enum","enums":["recipeBook"]}],"required":true},
            "targetId": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommentSwaggerResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "targetType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["recipe"]},{"dataType":"enum","enums":["recipeBook"]}],"required":true},
            "targetId": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
            "owner": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string"},
            "updatedAt": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommentSwaggerMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateCommentRequest": {
        "dataType": "refObject",
        "properties": {
            "targetType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["recipe"]},{"dataType":"enum","enums":["recipeBook"]}],"required":true},
            "targetId": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCommentRequest": {
        "dataType": "refObject",
        "properties": {
            "content": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "refreshToken": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequest": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RefreshResponse": {
        "dataType": "refObject",
        "properties": {
            "token": {"dataType":"string","required":true},
            "refreshToken": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RefreshRequest": {
        "dataType": "refObject",
        "properties": {
            "refreshToken": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LogoutRequest": {
        "dataType": "refObject",
        "properties": {
            "refreshToken": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AiRecipeSearchFilters": {
        "dataType": "refObject",
        "properties": {
            "ingredients": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "difficulty": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["easy"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["hard"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AiSearchResponse": {
        "dataType": "refObject",
        "properties": {
            "originalQuery": {"dataType":"string","required":true},
            "filters": {"ref":"AiRecipeSearchFilters","required":true},
            "recipes": {"dataType":"array","array":{"dataType":"any"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AiSearchRequest": {
        "dataType": "refObject",
        "properties": {
            "query": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsUserSwaggerController_getCurrentUser: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/users/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(UserSwaggerController.prototype.getCurrentUser)),

            async function UserSwaggerController_getCurrentUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserSwaggerController_getCurrentUser, request, response });

                const controller = new UserSwaggerController();

              await templateService.apiHandler({
                methodName: 'getCurrentUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserSwaggerController_updateCurrentUser: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"UpdateCurrentUserRequest"},
        };
        app.patch('/users/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(UserSwaggerController.prototype.updateCurrentUser)),

            async function UserSwaggerController_updateCurrentUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserSwaggerController_updateCurrentUser, request, response });

                const controller = new UserSwaggerController();

              await templateService.apiHandler({
                methodName: 'updateCurrentUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserSwaggerController_updateProfileImage: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"UpdateProfileImageRequest"},
        };
        app.patch('/users/profile-image',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(UserSwaggerController.prototype.updateProfileImage)),

            async function UserSwaggerController_updateProfileImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserSwaggerController_updateProfileImage, request, response });

                const controller = new UserSwaggerController();

              await templateService.apiHandler({
                methodName: 'updateProfileImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUploadSwaggerController_uploadImage: Record<string, TsoaRoute.ParameterSchema> = {
                _image: {"in":"formData","name":"_image","required":true,"dataType":"file"},
        };
        app.post('/upload/image',
            authenticateMiddleware([{"bearerAuth":[]}]),
            upload.fields([
                {
                    name: "_image",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(UploadSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(UploadSwaggerController.prototype.uploadImage)),

            async function UploadSwaggerController_uploadImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUploadSwaggerController_uploadImage, request, response });

                const controller = new UploadSwaggerController();

              await templateService.apiHandler({
                methodName: 'uploadImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_createNewRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"CreateRecipeRequest"},
        };
        app.post('/recipes',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.createNewRecipe)),

            async function RecipeSwaggerController_createNewRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_createNewRecipe, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'createNewRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_getAllRecipes: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/recipes',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.getAllRecipes)),

            async function RecipeSwaggerController_getAllRecipes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_getAllRecipes, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'getAllRecipes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_getMyRecipes: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/recipes/my',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.getMyRecipes)),

            async function RecipeSwaggerController_getMyRecipes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_getMyRecipes, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'getMyRecipes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_getRecipeById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/recipes/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.getRecipeById)),

            async function RecipeSwaggerController_getRecipeById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_getRecipeById, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'getRecipeById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_updateRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"ref":"UpdateRecipeRequest"},
        };
        app.put('/recipes/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.updateRecipe)),

            async function RecipeSwaggerController_updateRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_updateRecipe, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'updateRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_deleteRecipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/recipes/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.deleteRecipe)),

            async function RecipeSwaggerController_deleteRecipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_deleteRecipe, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'deleteRecipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeSwaggerController_updateRecipeImage: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"ref":"UpdateRecipeImageRequest"},
        };
        app.patch('/recipes/:id/image',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeSwaggerController.prototype.updateRecipeImage)),

            async function RecipeSwaggerController_updateRecipeImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeSwaggerController_updateRecipeImage, request, response });

                const controller = new RecipeSwaggerController();

              await templateService.apiHandler({
                methodName: 'updateRecipeImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_createRecipeBook: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"CreateRecipeBookRequest"},
        };
        app.post('/recipe-books',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.createRecipeBook)),

            async function RecipeBookSwaggerController_createRecipeBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_createRecipeBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'createRecipeBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_addRecipeToBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"string"},
        };
        app.post('/recipe-books/:bookId/recipes/:recipeId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.addRecipeToBook)),

            async function RecipeBookSwaggerController_addRecipeToBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_addRecipeToBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'addRecipeToBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_removeRecipeFromBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                recipeId: {"in":"path","name":"recipeId","required":true,"dataType":"string"},
        };
        app.delete('/recipe-books/:bookId/recipes/:recipeId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.removeRecipeFromBook)),

            async function RecipeBookSwaggerController_removeRecipeFromBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_removeRecipeFromBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'removeRecipeFromBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_getAllRecipeBooks: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/recipe-books',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.getAllRecipeBooks)),

            async function RecipeBookSwaggerController_getAllRecipeBooks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_getAllRecipeBooks, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'getAllRecipeBooks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_getMyRecipeBooks: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/recipe-books/my',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.getMyRecipeBooks)),

            async function RecipeBookSwaggerController_getMyRecipeBooks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_getMyRecipeBooks, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'getMyRecipeBooks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_getRecipeBookById: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        app.get('/recipe-books/:bookId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.getRecipeBookById)),

            async function RecipeBookSwaggerController_getRecipeBookById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_getRecipeBookById, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'getRecipeBookById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_deleteRecipeBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        app.delete('/recipe-books/:bookId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.deleteRecipeBook)),

            async function RecipeBookSwaggerController_deleteRecipeBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_deleteRecipeBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'deleteRecipeBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_shareRecipeBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"ref":"ShareRecipeBookRequest"},
        };
        app.post('/recipe-books/:bookId/share',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.shareRecipeBook)),

            async function RecipeBookSwaggerController_shareRecipeBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_shareRecipeBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'shareRecipeBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_unshareRecipeBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"userId":{"dataType":"string","required":true}}},
        };
        app.post('/recipe-books/:bookId/unshare',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.unshareRecipeBook)),

            async function RecipeBookSwaggerController_unshareRecipeBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_unshareRecipeBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'unshareRecipeBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_updateRecipeBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"ref":"UpdateRecipeBookRequest"},
        };
        app.put('/recipe-books/:bookId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.updateRecipeBook)),

            async function RecipeBookSwaggerController_updateRecipeBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_updateRecipeBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'updateRecipeBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRecipeBookSwaggerController_duplicateRecipeBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        app.post('/recipe-books/:bookId/duplicate',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(RecipeBookSwaggerController.prototype.duplicateRecipeBook)),

            async function RecipeBookSwaggerController_duplicateRecipeBook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRecipeBookSwaggerController_duplicateRecipeBook, request, response });

                const controller = new RecipeBookSwaggerController();

              await templateService.apiHandler({
                methodName: 'duplicateRecipeBook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLikeSwaggerController_like: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"LikeRequest"},
        };
        app.post('/likes',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LikeSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(LikeSwaggerController.prototype.like)),

            async function LikeSwaggerController_like(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLikeSwaggerController_like, request, response });

                const controller = new LikeSwaggerController();

              await templateService.apiHandler({
                methodName: 'like',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentSwaggerController_create: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"CreateCommentRequest"},
        };
        app.post('/comments',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController.prototype.create)),

            async function CommentSwaggerController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentSwaggerController_create, request, response });

                const controller = new CommentSwaggerController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentSwaggerController_getByTarget: Record<string, TsoaRoute.ParameterSchema> = {
                targetType: {"in":"query","name":"targetType","required":true,"dataType":"union","subSchemas":[{"dataType":"enum","enums":["recipe"]},{"dataType":"enum","enums":["recipeBook"]}]},
                targetId: {"in":"query","name":"targetId","required":true,"dataType":"string"},
        };
        app.get('/comments',
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController.prototype.getByTarget)),

            async function CommentSwaggerController_getByTarget(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentSwaggerController_getByTarget, request, response });

                const controller = new CommentSwaggerController();

              await templateService.apiHandler({
                methodName: 'getByTarget',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentSwaggerController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                _body: {"in":"body","name":"_body","required":true,"ref":"UpdateCommentRequest"},
        };
        app.put('/comments/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController.prototype.update)),

            async function CommentSwaggerController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentSwaggerController_update, request, response });

                const controller = new CommentSwaggerController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCommentSwaggerController_deleteComment: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/comments/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(CommentSwaggerController.prototype.deleteComment)),

            async function CommentSwaggerController_deleteComment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCommentSwaggerController_deleteComment, request, response });

                const controller = new CommentSwaggerController();

              await templateService.apiHandler({
                methodName: 'deleteComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthSwaggerController_register: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"RegisterRequest"},
        };
        app.post('/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController.prototype.register)),

            async function AuthSwaggerController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthSwaggerController_register, request, response });

                const controller = new AuthSwaggerController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthSwaggerController_login: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"LoginRequest"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController.prototype.login)),

            async function AuthSwaggerController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthSwaggerController_login, request, response });

                const controller = new AuthSwaggerController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthSwaggerController_refreshToken: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"RefreshRequest"},
        };
        app.post('/auth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController.prototype.refreshToken)),

            async function AuthSwaggerController_refreshToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthSwaggerController_refreshToken, request, response });

                const controller = new AuthSwaggerController();

              await templateService.apiHandler({
                methodName: 'refreshToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthSwaggerController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                _body: {"in":"body","name":"_body","required":true,"ref":"LogoutRequest"},
        };
        app.post('/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(AuthSwaggerController.prototype.logout)),

            async function AuthSwaggerController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthSwaggerController_logout, request, response });

                const controller = new AuthSwaggerController();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAiSwaggerController_aiSearch: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"AiSearchRequest"},
        };
        app.post('/ai/ai-search',
            ...(fetchMiddlewares<RequestHandler>(AiSwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(AiSwaggerController.prototype.aiSearch)),

            async function AiSwaggerController_aiSearch(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAiSwaggerController_aiSearch, request, response });

                const controller = new AiSwaggerController();

              await templateService.apiHandler({
                methodName: 'aiSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
