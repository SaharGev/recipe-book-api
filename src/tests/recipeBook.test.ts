//src/tests/recipeBook.test.ts

import request from "supertest";
import initApp from "../app";
import Recipe from "../models/recipeModel";
import RecipeBook from "../models/recipeBookModel";
import { Express } from "express";
import { otherUsers, getlogedInUser, UserData, recipesList, recipeBooksList, createRecipeBook, getLoggedInCustomUser } from "./utils";

let app: Express;
let loginUser = UserData;

beforeAll(async () => {
  app = await initApp();
  await RecipeBook.deleteMany();
  await Recipe.deleteMany();
  loginUser = await getlogedInUser(app);
});

afterAll((done) => {
  done();
});


describe("RecipeBook API", () => {
    test("Create Recipe Book", async () => {
        const newBook = {
            name: "My First Recipe Book",
            description: "A collection of my favorite recipes",
            isPublic: false
        };
        const response = await request(app).post("/recipe-books")
        .set("Authorization", "Bearer " + loginUser.token)
        .send(newBook);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newBook.name);
        expect(response.body.description).toBe(newBook.description);
        expect(response.body.isPublic).toBe(newBook.isPublic);
        expect(response.body.owner).toBe(loginUser._id);
        expect(response.body.recipes).toEqual([]);
        expect(response.body.recipesCount).toBe(0);
    });

    
    test("Add an existing recipe to a Recipe Book", async () => {
    // create a recipe book
    const bookResp = await request(app)
      .post("/recipe-books")
      .set("Authorization", "Bearer " + loginUser.token)
      .send({
        name: "Book for Adding Recipes",
        description: "Test adding recipes",
        isPublic: false
      });
    expect(bookResp.status).toBe(201);
    const recipeBookId = bookResp.body._id;

    // create a recipe
    const recipeResp = await request(app)
      .post("/recipes")
      .set("Authorization", "Bearer " + loginUser.token)
      .send(recipesList[0]);
    expect(recipeResp.status).toBe(201);
    const recipeId = recipeResp.body._id;

    // add the recipe to the book
    const addResp = await request(app)
      .post(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + loginUser.token);
    expect(addResp.status).toBe(200);
    expect(addResp.body.recipeBook.recipes).toContain(recipeId);
    expect(addResp.body.recipeBook.recipesCount).toBe(1);

    // try adding the same recipe again - should fail
    const addAgainResp = await request(app)
      .post(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + loginUser.token);
    expect(addAgainResp.status).toBe(400);
    expect(addAgainResp.body.message).toBe("Recipe already in book");
    });

  
    test("Collaborator can add owner's recipe to Recipe Book", async () => {
        const bookResp = await createRecipeBook(app, loginUser.token, {
          name: "Book with Collaborator",
          description: "Test collaborator adding recipe",
          isPublic: false
        });
        const recipeBookId = bookResp.body._id;

        const collabUser = { email: "collab@example.com", username: "collabuser", password: "testpassword" };
        const collabLogged = await getLoggedInCustomUser(app, collabUser);
        await RecipeBook.findByIdAndUpdate(recipeBookId, {
          $push: { collaborators: { user: collabLogged._id, role: "editor" } },
        });

        const recipeResp = await request(app)
          .post("/recipes")
          .set("Authorization", "Bearer " + loginUser.token)
          .send(recipesList[1]);
        const recipeId = recipeResp.body._id;

        const addResp = await request(app)
          .post(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
          .set("Authorization", "Bearer " + collabLogged.token);

        expect(addResp.status).toBe(200);
        expect(addResp.body.recipeBook.recipes).toContain(recipeId);
        expect(addResp.body.recipeBook.recipesCount).toBe(1);
    });

    test("Remove a recipe from a Recipe Book", async () => {
    const bookResp = await createRecipeBook(app, loginUser.token, {
      name: "Book for Removing Recipes",
      description: "Test removing recipes",
      isPublic: false,
    });
    const recipeBookId = bookResp.body._id;

    const recipeResp = await request(app)
      .post("/recipes")
      .set("Authorization", "Bearer " + loginUser.token)
      .send(recipesList[0]);
    expect(recipeResp.status).toBe(201);
    const recipeId = recipeResp.body._id;

    const addResp = await request(app)
      .post(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + loginUser.token);
    expect(addResp.status).toBe(200);
    expect(addResp.body.recipeBook.recipes).toContain(recipeId);
    expect(addResp.body.recipeBook.recipesCount).toBe(1);

    const removeResp = await request(app)
      .delete(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + loginUser.token);

    expect(removeResp.status).toBe(200);
    expect(removeResp.body.recipeBook.recipes).not.toContain(recipeId);
    expect(removeResp.body.recipeBook.recipesCount).toBe(0);

    const removeAgainResp = await request(app)
      .delete(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + loginUser.token);
    expect(removeAgainResp.status).toBe(404);
    expect(removeAgainResp.body.message).toBe("Recipe not in book");

    const collabUser = { email: "collab3@example.com", username: "collabuser3", password: "testpassword" };
    const collabLogged = await getLoggedInCustomUser(app, collabUser);

    await RecipeBook.findByIdAndUpdate(recipeBookId, {
      $push: { collaborators: { user: collabLogged._id, role: "editor" } },
    });

    await request(app)
      .post(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + loginUser.token);

    const collabRemoveResp = await request(app)
      .delete(`/recipe-books/${recipeBookId}/recipes/${recipeId}`)
      .set("Authorization", "Bearer " + collabLogged.token);

    expect(collabRemoveResp.status).toBe(200);
    expect(collabRemoveResp.body.recipeBook.recipes).not.toContain(recipeId);
    expect(collabRemoveResp.body.recipeBook.recipesCount).toBe(0);
    });

    test("Get all recipe books for a user", async () => {
    const ownedBookResp = await createRecipeBook(app, loginUser.token, {
      name: "Owned Book",
      description: "Book owned by user",
      isPublic: false,
    });
    const ownedBookId = ownedBookResp.body._id;

    const publicBookResp = await createRecipeBook(app, loginUser.token, {
      name: "Public Book",
      description: "This book is public",
      isPublic: true,
    });
    const publicBookId = publicBookResp.body._id;

    const collabUser = { email: "collab2@example.com", username: "collabuser2", password: "testpassword" };
    const collabLogged = await getLoggedInCustomUser(app, collabUser);

    const collabBookResp = await createRecipeBook(app, loginUser.token, {
      name: "Book with collaborator",
      description: "Shared book",
      isPublic: false,
    });
    const collabBookId = collabBookResp.body._id;
    await RecipeBook.findByIdAndUpdate(collabBookId, {
      $push: { collaborators: { user: collabLogged._id, role: "editor" } },
    });

    const response = await request(app)
      .get("/recipe-books")
      .set("Authorization", "Bearer " + loginUser.token);

    expect(response.status).toBe(200);
    expect(response.body.recipeBooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: ownedBookId }),
        expect.objectContaining({ _id: publicBookId }),
        expect.objectContaining({ _id: collabBookId }),
      ])
    );

    response.body.recipeBooks.forEach((book: any) => {
      expect(book).toHaveProperty("name");
      expect(book).toHaveProperty("owner");
    });
    });

    test("Get only my recipe books", async () => {
      // Books owned by the user
      const ownedBookResp1 = await createRecipeBook(app, loginUser.token, {
        name: "My Book 1",
        description: "First book",
        isPublic: false,
      });
      const ownedBookResp2 = await createRecipeBook(app, loginUser.token, {
        name: "My Book 2",
        description: "Second book",
        isPublic: true, 
      });

      const ownedBookIds = [ownedBookResp1.body._id, ownedBookResp2.body._id];

      // Book owned by another user
      const otherUser = { email: "otheruser@example.com", username: "otheruser", password: "password123" };
      const otherLogged = await getLoggedInCustomUser(app, otherUser);

      const publicBookResp = await createRecipeBook(app, otherLogged.token, {
        name: "Other User Public Book",
        description: "Not mine",
        isPublic: true,
      });

      const response = await request(app)
        .get("/recipe-books/my")
        .set("Authorization", "Bearer " + loginUser.token);

      expect(response.status).toBe(200);

      // Only the books owned by the user should be returned
      const myBookIds = response.body.recipeBooks.map((b: any) => b._id);
      expect(myBookIds).toEqual(expect.arrayContaining(ownedBookIds));
      expect(myBookIds).not.toContain(publicBookResp.body._id);

      // Check that all returned books are owned by the logged-in user
      response.body.recipeBooks.forEach((book: any) => {
        expect(book.owner._id).toBe(loginUser._id);
      });
    });

    test("Get a recipe book by ID", async () => {
      // create a recipe book
      const bookResp = await createRecipeBook(app, loginUser.token, {
        name: "Book for GetById",
        description: "Testing get by ID",
        isPublic: false,
      });
      const bookId = bookResp.body._id;

      // owner should be able to get the book
      const ownerResp = await request(app)
        .get(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + loginUser.token);
      
      expect(ownerResp.status).toBe(200);
      expect(ownerResp.body.recipeBook._id).toBe(bookId);

      // create a collaborator user and add to the book
      const collabUser = { email: "collabgetbyid@example.com", username: "collabgetbyid", password: "password123" };
      const collabLogged = await getLoggedInCustomUser(app, collabUser);
      
      await RecipeBook.findByIdAndUpdate(bookId, {
        $push: { collaborators: { user: collabLogged._id, role: "editor" } },
      });

      // collaborator should be able to get the book
      const collabResp = await request(app)
        .get(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + collabLogged.token);

      expect(collabResp.status).toBe(200);
      expect(collabResp.body.recipeBook._id).toBe(bookId);

      // other user should not be able to get the book
      const otherUser = { email: "othergetbyid@example.com", username: "othergetbyid", password: "password123" };
      const otherLogged = await getLoggedInCustomUser(app, otherUser);
      
      const forbiddenResp = await request(app)
        .get(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + otherLogged.token);

      expect(forbiddenResp.status).toBe(403);
      expect(forbiddenResp.body.message).toBe("Forbidden");

      // public book should be accessible by other user
      const publicBookResp = await createRecipeBook(app, loginUser.token, {
        name: "Public Book for GetById",
        description: "Public book",
        isPublic: true,
      });
      const publicBookId = publicBookResp.body._id;

      const publicResp = await request(app)
        .get(`/recipe-books/${publicBookId}`)
        .set("Authorization", "Bearer " + otherLogged.token);

      expect(publicResp.status).toBe(200);
      expect(publicResp.body.recipeBook._id).toBe(publicBookId);
    });

    test("Delete Recipe Book - owner and collaborator can delete, other users cannot", async () => {
      // Owner creates a recipe book
      const createResp = await createRecipeBook(app, loginUser.token, {
        name: "Test Book",
        description: "Test Desc",
        isPublic: false,
      });
      expect(createResp.status).toBe(201);
      const bookId = createResp.body._id;

      // Register a collaborator user (otherUsers[0])
      const collaboratorData = otherUsers[0];
      const collaboratorUser = await getLoggedInCustomUser(app, collaboratorData);

      // Owner adds the collaborator directly in DB (bypass PUT API)
      await RecipeBook.findByIdAndUpdate(bookId, {
        $push: { collaborators: { user: collaboratorUser._id, role: "editor" } },
      });

      // Collaborator deletes the book - should succeed
      const deleteByCollabResp = await request(app)
        .delete(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + collaboratorUser.token);
      expect(deleteByCollabResp.status).toBe(200);
      expect(deleteByCollabResp.body.message).toBe("Recipe book deleted successfully");

      // Owner creates another book
      const createResp2 = await createRecipeBook(app, loginUser.token, {
        name: "Test Book 2",
        description: "Desc 2",
        isPublic: false,
      });
      expect(createResp2.status).toBe(201);
      const bookId2 = createResp2.body._id;

      // Another user (otherUsers[1]) tries to delete - should fail
      const otherUserData = otherUsers[1];
      const otherUser = await getLoggedInCustomUser(app, otherUserData);

      const deleteByOtherResp = await request(app)
        .delete(`/recipe-books/${bookId2}`)
        .set("Authorization", "Bearer " + otherUser.token);
      expect(deleteByOtherResp.status).toBe(403);
      expect(deleteByOtherResp.body.message).toBe("Forbidden");

      // Owner deletes the second book - should succeed
      const deleteByOwnerResp = await request(app)
        .delete(`/recipe-books/${bookId2}`)
        .set("Authorization", "Bearer " + loginUser.token);
      expect(deleteByOwnerResp.status).toBe(200);
      expect(deleteByOwnerResp.body.message).toBe("Recipe book deleted successfully");
    });

    test("Share recipe book - only owner can share and collaborator gets access", async () => {
      // Owner creates a book
      const bookResp = await createRecipeBook(app, loginUser.token, {
        name: "Book to Share",
        description: "Sharing test",
        isPublic: false,
      });
      expect(bookResp.status).toBe(201);
      const bookId = bookResp.body._id;

      // Create another user to share with
      const targetUserData = {
        email: "shareuser@example.com",
        username: "shareuser",
        password: "password123",
      };
      const targetUser = await getLoggedInCustomUser(app, targetUserData);

      // Owner shares the book
      const shareResp = await request(app)
        .post(`/recipe-books/${bookId}/share`)
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ targetUserId: targetUser._id });

      expect(shareResp.status).toBe(200);
      expect(shareResp.body.message).toBe("Recipe book shared successfully");

      // Verify collaborator was added
      const updatedBook = await RecipeBook.findById(bookId);
      const collaboratorIds = updatedBook?.collaborators.map((c: any) =>
        c.user.toString()
      );
      expect(collaboratorIds).toContain(targetUser._id.toString());

      // Collaborator should now be able to access the book
      const collabGetResp = await request(app)
        .get(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + targetUser.token);

      expect(collabGetResp.status).toBe(200);
      expect(collabGetResp.body.recipeBook._id).toBe(bookId);

      // Another random user tries to share – should fail
      const otherUserData = {
        email: "notowner@example.com",
        username: "notowner",
        password: "password123",
      };
      const otherUser = await getLoggedInCustomUser(app, otherUserData);

      const forbiddenShareResp = await request(app)
        .post(`/recipe-books/${bookId}/share`)
        .set("Authorization", "Bearer " + otherUser.token)
        .send({ targetUserId: otherUser._id });

      expect(forbiddenShareResp.status).toBe(403);
      expect(forbiddenShareResp.body.message).toBe(
        "Only the owner can share the recipe book"
      );

      // Sharing same user again should fail
      const shareAgainResp = await request(app)
        .post(`/recipe-books/${bookId}/share`)
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ targetUserId: targetUser._id });

      expect(shareAgainResp.status).toBe(400);
      expect(shareAgainResp.body.message).toBe("User is already a collaborator");
    });

    test("Unshare recipe book - only owner can remove collaborator", async () => {
      // Owner creates a book
      const bookResp = await createRecipeBook(app, loginUser.token, {
        name: "Book to Unshare",
        description: "Unshare test",
        isPublic: false,
      });
      expect(bookResp.status).toBe(201);
      const bookId = bookResp.body._id;

      // Create collaborator
      const collabUserData = {
        email: "unsharecollab@example.com",
        username: "unsharecollab",
        password: "password123",
      };
      const collabUser = await getLoggedInCustomUser(app, collabUserData);

      // Owner shares the book
      await request(app)
        .post(`/recipe-books/${bookId}/share`)
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ targetUserId: collabUser._id });

      // Verify collaborator exists
      let book = await RecipeBook.findById(bookId);
      expect(
        book?.collaborators.some(
          (c: any) => c.user.toString() === collabUser._id.toString()
        )
      ).toBe(true);

      // Owner unshares (removes collaborator)
      const unshareResp = await request(app)
        .post(`/recipe-books/${bookId}/unshare`)
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ targetUserId: collabUser._id });

      expect(unshareResp.status).toBe(200);
      expect(unshareResp.body.message).toBe("Collaborator removed successfully");

      // Verify collaborator was removed
      book = await RecipeBook.findById(bookId);
      expect(
        book?.collaborators.some(
          (c: any) => c.user.toString() === collabUser._id.toString()
        )
      ).toBe(false);

      // Removed collaborator should NOT be able to access the book
      const forbiddenGetResp = await request(app)
        .get(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + collabUser.token);

      expect(forbiddenGetResp.status).toBe(403);

      // Another user tries to unshare – should fail
      const otherUserData = {
        email: "notownerunshare@example.com",
        username: "notownerunshare",
        password: "password123",
      };
      const otherUser = await getLoggedInCustomUser(app, otherUserData);

      const forbiddenUnshareResp = await request(app)
        .post(`/recipe-books/${bookId}/unshare`)
        .set("Authorization", "Bearer " + otherUser.token)
        .send({ targetUserId: collabUser._id });

      expect(forbiddenUnshareResp.status).toBe(403);
      expect(forbiddenUnshareResp.body.message).toBe(
        "Only the owner can remove collaborators"
      );

      // Trying to unshare a user that is not a collaborator
      const notCollabUserData = {
        email: "notcollab@example.com",
        username: "notcollab",
        password: "password123",
      };
      const notCollabUser = await getLoggedInCustomUser(app, notCollabUserData);

      const notFoundUnshareResp = await request(app)
        .post(`/recipe-books/${bookId}/unshare`)
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ targetUserId: notCollabUser._id });

      expect(notFoundUnshareResp.status).toBe(404);
      expect(notFoundUnshareResp.body.message).toBe("User is not a collaborator");
    });

    test("Owner and collaborator can update recipe book", async () => {
      const bookResp = await createRecipeBook(app, loginUser.token, {
        name: "Original Name",
        description: "Original Desc",
        isPublic: false,
      });
      const bookId = bookResp.body._id;

      // collaborator
      const collabUser = {
        email: "updatecollab@example.com",
        username: "updatecollab",
        password: "password123",
      };
      const collabLogged = await getLoggedInCustomUser(app, collabUser);

      await RecipeBook.findByIdAndUpdate(bookId, {
        $push: { collaborators: { user: collabLogged._id } },
      });

      // owner update
      const ownerUpdate = await request(app)
        .put(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + loginUser.token)
        .send({ name: "Updated by Owner" });

      expect(ownerUpdate.status).toBe(200);

      // collaborator update
      const collabUpdate = await request(app)
        .put(`/recipe-books/${bookId}`)
        .set("Authorization", "Bearer " + collabLogged.token)
        .send({ description: "Updated by Collaborator" });

      expect(collabUpdate.status).toBe(200);

      const updatedBook = await RecipeBook.findById(bookId);
      expect(updatedBook?.name).toBe("Updated by Owner");
      expect(updatedBook?.description).toBe("Updated by Collaborator");
    });

    test("Duplicate recipe book - owner, collaborator and public access rules", async () => {
      // Owner creates a book
      const originalBookResp = await createRecipeBook(app, loginUser.token, {
        name: "Original Book",
        description: "Test book for duplication",
        isPublic: true,
      });
      const originalBookId = originalBookResp.body._id;

      // Create a recipe in owner's account
      const recipeResp = await request(app)
        .post("/recipes")
        .set("Authorization", "Bearer " + loginUser.token)
        .send(recipesList[0]);
      const recipeId = recipeResp.body._id;

      // Add recipe to the original book
      await request(app)
        .post(`/recipe-books/${originalBookId}/recipes/${recipeId}`)
        .set("Authorization", "Bearer " + loginUser.token);

      // Owner duplicates their own book
      const duplicateByOwnerResp = await request(app)
        .post(`/recipe-books/${originalBookId}/duplicate`)
        .set("Authorization", "Bearer " + loginUser.token);

      expect(duplicateByOwnerResp.status).toBe(201);
      expect(duplicateByOwnerResp.body.recipeBook.owner).toBe(loginUser._id);
      expect(duplicateByOwnerResp.body.recipeBook.name).toContain("Copy of");
      expect(
        duplicateByOwnerResp.body.recipeBook.recipes.map((r: any) => r._id)
      ).toContain(recipeId);
      expect(duplicateByOwnerResp.body.recipeBook.recipesCount).toBe(1);
      expect(duplicateByOwnerResp.body.recipeBook.isPublic).toBe(false);
      expect(duplicateByOwnerResp.body.recipeBook.collaborators.length).toBe(0);

      // Add a collaborator
      const collabUser = { email: "collabduplicate@example.com", username: "collabdup", password: "password123" };
      const collabLogged = await getLoggedInCustomUser(app, collabUser);
      await RecipeBook.findByIdAndUpdate(originalBookId, {
        $push: { collaborators: { user: collabLogged._id, role: "editor" } },
      });

      // Collaborator duplicates the book
      const duplicateByCollabResp = await request(app)
        .post(`/recipe-books/${originalBookId}/duplicate`)
        .set("Authorization", "Bearer " + collabLogged.token);
      expect(duplicateByCollabResp.status).toBe(201);
      expect(duplicateByCollabResp.body.recipeBook.owner).toBe(collabLogged._id);
      expect(duplicateByCollabResp.body.recipeBook.name).toContain("Copy of");
      expect(
        duplicateByCollabResp.body.recipeBook.recipes.map((r: any) => r._id)
      ).toContain(recipeId);
      expect(duplicateByCollabResp.body.recipeBook.recipesCount).toBe(1);
      expect(duplicateByCollabResp.body.recipeBook.isPublic).toBe(false);
      expect(duplicateByCollabResp.body.recipeBook.collaborators.length).toBe(0);

      // Another user (not collaborator) tries to duplicate public book
      const otherUser = { email: "otherduplicate@example.com", username: "otherdup", password: "password123" };
      const otherLogged = await getLoggedInCustomUser(app, otherUser);
      const duplicateByOtherResp = await request(app)
        .post(`/recipe-books/${originalBookId}/duplicate`)
        .set("Authorization", "Bearer " + otherLogged.token);

      expect(duplicateByOtherResp.status).toBe(201);
      expect(duplicateByOtherResp.body.recipeBook.owner).toBe(otherLogged._id);
      expect(duplicateByOtherResp.body.recipeBook.name).toContain("Copy of");
      expect(
        duplicateByOtherResp.body.recipeBook.recipes.map((r: any) => r._id)
      ).toContain(recipeId);
      expect(duplicateByOtherResp.body.recipeBook.recipesCount).toBe(1);
      expect(duplicateByOtherResp.body.recipeBook.isPublic).toBe(false);
      expect(duplicateByOtherResp.body.recipeBook.collaborators.length).toBe(0);

      // Another user tries to duplicate private book (should fail)
      const privateBookResp = await createRecipeBook(app, loginUser.token, {
        name: "Private Book",
        description: "Not public",
        isPublic: false,
      });
      const privateBookId = privateBookResp.body._id;

      const forbiddenDuplicateResp = await request(app)
        .post(`/recipe-books/${privateBookId}/duplicate`)
        .set("Authorization", "Bearer " + otherLogged.token);
      expect(forbiddenDuplicateResp.status).toBe(403);
      expect(forbiddenDuplicateResp.body.message).toBe("Forbidden");
    });

  });