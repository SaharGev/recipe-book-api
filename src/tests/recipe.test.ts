//src/tests/recipes.test.ts

import request from "supertest";
import initApp from "../app";
import Recipe from "../models/recipeModel";
import { Express } from "express";
import { getlogedInUser, UserData, RecipeData, recipesList, otherUsers } from "./utils";


let app: Express;
let loginUser = UserData;
let recipeId = "";

beforeAll(async () => {
  app = await initApp();
  await Recipe.deleteMany();
  loginUser = await getlogedInUser(app);
});

afterAll((done) => {
  done();
});


describe("Recipe API", () => {

  test("Create Recipe", async () => {
    for (const recipe of recipesList) {
      const response = await request(app).post("/recipes")
      .set("Authorization", "Bearer " + loginUser.token)
      .send(recipe);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(recipe.title);
      // expect(response.body.owner).toBe(recipe.owner);
      expect(response.body.description).toBe(recipe.description);
      expect(response.body.ingredients).toEqual(recipe.ingredients);
      expect(response.body.cookTime).toBe(recipe.cookTime);
      expect(response.body.difficulty).toBe(recipe.difficulty);
      expect(response.body.isPublic).toBe(recipe.isPublic);
      expect(response.body.imageUrl).toBe(recipe.imageUrl);   
      expect(response.body.owner).toBe(loginUser._id);
    }
  });
  
  test("Get All Recipes - returns only public recipes", async () => {
  const response = await request(app).get("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)  ;
  expect(response.status).toBe(200);
  const publicRecipes = recipesList.filter(r => r.isPublic);
  const myRecipes = recipesList;
  const expectedCountWithMine = new Set([...publicRecipes.map(r => r.title), ...myRecipes.map(r => r.title)]).size;
  expect(response.body.length).toBe(expectedCountWithMine);
  response.body.forEach((recipe: any) => {
    expect(recipe.isPublic || recipe.owner === loginUser._id).toBe(true);
  });
});

test("Get All Recipes - includes public, mine, and collaborator recipes", async () => {
  // create a recipe by another user
  const otherUser = otherUsers[0];
  let token = "";
  const otherUserLoginResponse = await request(app)
    .post("/auth/register")
    .send({ email: otherUser.email, username: otherUser.username, password: otherUser.password });

  if (otherUserLoginResponse.status === 201) {
    token = otherUserLoginResponse.body.token;
  } else {
    const loginResp = await request(app)
      .post("/auth/login")
      .send({ email: otherUser.email, password: otherUser.password });
    token = loginResp.body.token;
  }

  // other user creates a private recipe
  const otherRecipeResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + token)
    .send({ ...recipesList[2], title: "Other Private Recipe", isPublic: false });
  expect(otherRecipeResponse.status).toBe(201);
  const otherRecipeId = otherRecipeResponse.body._id;

  // the owner adds himself as collaborator to the other user's private recipe
  await request(app)
    .put(`/recipes/${otherRecipeId}`)
    .set("Authorization", `Bearer ${token}`)   
    .send({ collaborators: [{ user: loginUser._id, role: "editor" }] });

  // check: the owner can see the other user's private recipe in the list of all recipes
  const response = await request(app)
    .get("/recipes")
    .set("Authorization", "Bearer " + loginUser.token);
  expect(response.status).toBe(200);

  // check that the other user's private recipe is included in the response
  const titles = response.body.map((r: any) => r.title);
  expect(titles).toContain("Other Private Recipe");
  
  // check that all public recipes and the owner's recipes are included as well
  recipesList.forEach((recipe) => {
    expect(titles).toContain(recipe.title);
  });
});

  test("Get My Recipes of the owner who send the request - public and private", async () => {
    const response = await request(app).get("/recipes/my")
    .set("Authorization", "Bearer " + loginUser.token)  ;
    expect(response.status).toBe(200);
    const myRecipes = response.body;
    expect(myRecipes.length).toBe(recipesList.length);
    myRecipes.forEach((recipe: any) => {
      expect(recipe.owner).toBe(loginUser._id);
    });
    const othersRecipes = response.body.filter((r: any) => r.owner !== loginUser._id);
    expect(othersRecipes.length).toBe(0); 
  });

test("Get Recipe By Id - returns the recipe if it's public or owned by the user", async () => {
  // owner creates a public recipe
  const publicRecipeResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[0]);
  expect(publicRecipeResponse.status).toBe(201);
  const publicRecipeId = publicRecipeResponse.body._id;

  // check: the owner can access the public recipe
  const getPublic = await request(app).get(`/recipes/${publicRecipeId}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(getPublic.status).toBe(200);
  expect(getPublic.body._id).toBe(publicRecipeId);

  // owner creates a private recipe
  const privateRecipeResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[2]);
  expect(privateRecipeResponse.status).toBe(201);
  const privateRecipeId = privateRecipeResponse.body._id;

  // check: the owner can access the private recipe he created
  const getPrivate = await request(app).get(`/recipes/${privateRecipeId}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(getPrivate.status).toBe(200);
  expect(getPrivate.body._id).toBe(privateRecipeId);

  // other user creates a private recipe
  const otherUser = otherUsers[0];
  const otherUserLoginResponse = await request(app)
    .post("/auth/register")
    .send({ email: otherUser.email, username: otherUser.username, password: otherUser.password });

  let token = "";
  if (otherUserLoginResponse.status === 201) {
    token = otherUserLoginResponse.body.token;
  } else {
    const loginResp = await request(app)
      .post("/auth/login")
      .send({ email: otherUser.email, password: otherUser.password });
    token = loginResp.body.token;
  }

  const otherRecipeResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + token)
    .send({ ...recipesList[2], title: "Other Private Recipe", isPublic: false });
  expect(otherRecipeResponse.status).toBe(201);
  const otherRecipeId = otherRecipeResponse.body._id;

  // check: the owner cannot access the private recipe created by other user
  const getOther = await request(app).get(`/recipes/${otherRecipeId}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(getOther.status).toBe(403);

  // add loginUser as collaborator to other user's private recipe
const addCollaboratorResponse = await request(app)
  .put(`/recipes/${otherRecipeId}`)
  .set("Authorization", "Bearer " + token) // owner of the recipe
  .send({
    collaborators: [{ user: loginUser._id }],
  });

expect(addCollaboratorResponse.status).toBe(200);

// check: collaborator can access the private recipe
const getAsCollaborator = await request(app)
  .get(`/recipes/${otherRecipeId}`)
  .set("Authorization", "Bearer " + loginUser.token);

expect(getAsCollaborator.status).toBe(200);
expect(getAsCollaborator.body._id).toBe(otherRecipeId);
});

test("Update Recipe - owner can update", async () => {
  // Owner creates a recipe
  const createResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[0]);
  expect(createResponse.status).toBe(201);
  const recipeId = createResponse.body._id;

  // Owner updates the recipe
  const updateResponse = await request(app)
    .put(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + loginUser.token)
    .send({ title: "Updated By Owner" });

  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.title).toBe("Updated By Owner");
});

test("Update Recipe - collaborator can update", async () => {
  const collaborator = otherUsers[1];

  // Owner creates a recipe
  const createResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[1]);
  expect(createResponse.status).toBe(201);
  const recipeId = createResponse.body._id;

  // Login/register collaborator
  let collaboratorToken = "";
  let collaboratorId = "";

  const collaboratorRegisterResp = await request(app)
    .post("/auth/register")
    .send({ email: collaborator.email, username: collaborator.username, password: collaborator.password });

  if (collaboratorRegisterResp.status === 201) {
    collaboratorToken = collaboratorRegisterResp.body.token;
    collaboratorId = collaboratorRegisterResp.body._id; // _id מהמסד
  } else {
    const loginResp = await request(app)
      .post("/auth/login")
      .send({ email: collaborator.email, password: collaborator.password });
    collaboratorToken = loginResp.body.token;
    collaboratorId = loginResp.body._id;
  }

  // add collaborator to the recipe
  await Recipe.findByIdAndUpdate(recipeId, {
    $push: { collaborators: { user: collaboratorId, role: "editor" } }
  });

  // Collaborator trying to update the recipe
  const collaboratorUpdateResponse = await request(app)
    .put(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + collaboratorToken)
    .send({ title: "Updated By Collaborator" });

  expect(collaboratorUpdateResponse.status).toBe(200);
  expect(collaboratorUpdateResponse.body.title).toBe("Updated By Collaborator");
});

test("Update Recipe - other user cannot update", async () => {
  const otherUser = otherUsers[0];

  // Owner creates a recipe
  const createResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[2]);
  expect(createResponse.status).toBe(201);
  const recipeId = createResponse.body._id;

  // Login / register other user
  let token = "";
  const otherUserRegisterResp = await request(app)
    .post("/auth/register")
    .send({ email: otherUser.email, username: otherUser.username, password: otherUser.password });

  if (otherUserRegisterResp.status === 201) {
    token = otherUserRegisterResp.body.token;
  } else {
    const loginResp = await request(app)
      .post("/auth/login")
      .send({ email: otherUser.email, password: otherUser.password });
    token = loginResp.body.token;
  }

  // Other user trying to update the recipe
  const otherUserUpdateResponse = await request(app)
    .put(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + token)
    .send({ title: "Other User Updated Title" });

  expect(otherUserUpdateResponse.status).toBe(403);
});

test("Delete Recipe - only the owner can delete", async () => {
  const createResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[1]);
  expect(createResponse.status).toBe(201);
  const recipeId = createResponse.body._id;
  const deleteResponse = await request(app)
    .delete(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body.message).toBe("Recipe deleted successfully");
  const getAfterDelete = await request(app).get(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(getAfterDelete.status).toBe(404);


  const createResponse2 = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[2]);
  expect(createResponse2.status).toBe(201);
  const recipeId2 = createResponse2.body._id;
  const otherUser = otherUsers[0];
  let token = "";
  const otherUserLoginResponse = await request(app)
    .post("/auth/register")
    .send({ email: otherUser.email, username: otherUser.username, password: otherUser.password });
  if (otherUserLoginResponse.status === 201) {
    token = otherUserLoginResponse.body.token;
  } else {
    const loginResp = await request(app)
      .post("/auth/login")
      .send({ email: otherUser.email, password: otherUser.password });
    token = loginResp.body.token;
  }
  const otherDeleteResponse = await request(app)
    .delete(`/recipes/${recipeId2}`)
    .set("Authorization", "Bearer " + token);
  expect(otherDeleteResponse.status).toBe(403);

  const finalGet = await request(app).get(`/recipes/${recipeId2}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(finalGet.status).toBe(200);
});

test("Delete Recipe - collaborator can delete", async () => {
  const collaboratorData = otherUsers[1];
  // Owner creates a recipe
  const createResponse = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + loginUser.token)
    .send(recipesList[1]);
  expect(createResponse.status).toBe(201);
  const recipeId = createResponse.body._id;

  // Login/register collaborator
  let collaboratorToken = "";
  let collaboratorId = "";

  const collaboratorRegister = await request(app)
    .post("/auth/register")
    .send({
      email: collaboratorData.email,
      username: collaboratorData.username,
      password: collaboratorData.password,
    });

  if (collaboratorRegister.status === 201) {
    collaboratorToken = collaboratorRegister.body.token;
    collaboratorId = collaboratorRegister.body._id; 
  } else {
    const loginResp = await request(app)
      .post("/auth/login")
      .send({ email: collaboratorData.email, password: collaboratorData.password });
    collaboratorToken = loginResp.body.token;
    collaboratorId = loginResp.body._id; 
  }

  const addCollaboratorResponse = await request(app)
    .put(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + loginUser.token) 
    .send({
      collaborators: [{ user: collaboratorId, role: "editor" }],
    });
  expect(addCollaboratorResponse.status).toBe(200);

  const deleteResponse = await request(app)
    .delete(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + collaboratorToken);
  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body.message).toBe("Recipe deleted successfully");

  const getAfterDelete = await request(app)
    .get(`/recipes/${recipeId}`)
    .set("Authorization", "Bearer " + loginUser.token);
  expect(getAfterDelete.status).toBe(404);
});



});
