// app.test.js
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/notARoute", () => {
  it("responds with a 404 status code and returns the correct error message", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route does not exist");
      });
  });
});

describe("GET /api/topics", () => {
  it("responds with a 200 status code and returns the correct number of results, with each result having the correct structure", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  it("responds with a 200 status code and an accurate JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("responds with a 200 status code and returns an object with the correct structure", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("responds with a 404 status code and returns the correct error message when passed an article_id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No article found for article_id: 999999"
        );
      });
  });
});

describe("GET /api/articles", () => {
  it("responds with a 200 status code and returns an array with the correct number of objects, sorted by the most recent article, and with each object having the correct structure", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("responds with a 200 status code and returns an array with the correct number of objects, sorted by the most recent comment, and with each object having the correct structure", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            article_id: 1,
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("responds with a 404 status code and returns the correct error message when passed an article_id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No article found for article_id: 999999"
        );
      });
  });
  it("responds with a 200 status code and returns an empty array when passed an article_id which doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("responds with a 201 status code and returns the correctly structured posted comment", () => {
    const comment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 19,
          body: "This is a test comment",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("responds with a 404 status code and the correct error message when passed an article_id that doesn't exist", () => {
    const comment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(comment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No article found for article_id: 999999"
        );
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid article_id", () => {
    const comment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("responds with a 404 status code and returns the correct error message when passed a username that doesn't exist", () => {
    const comment = {
      username: "test_user",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No user found with the username: test_user"
        );
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an empty username or empty comment", () => {
    const comment = {
      username: "",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Username or comment can't be empty");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("responds with a 200 status code and returns the correctly structured updated article", () => {
    const inc_votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });
  it("responds with a 404 status code and the correct error message when passed an article_id that doesn't exist", () => {
    const inc_votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999999")
      .send(inc_votes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No article found for article_id: 999999"
        );
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid article_id", () => {
    const inc_votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/notAnId")
      .send(inc_votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed no votes", () => {
    const inc_votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Votes cannot be blank");
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid inc_votes", () => {
    const inc_votes = { inc_votes: "notAVote" };
    return request(app)
      .patch("/api/articles/1")
      .send(inc_votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Votes must be a number");
      });
  });
});

describe("DELETE /api/comments/comment_id", () => {
  it("responds with a 204 status code", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("responds with a 404 status code and the correct error message when passed a comment_id that doesn't exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No comment found for comment_id: 999999"
        );
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  it("responds with a 200 status code and returns the correct number of results, with each result having the correct structure", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            name: expect.any(String),
            username: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
