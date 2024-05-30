// app.test.js
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  console.log("Seeding");
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
  it("responds with a 200 status code and returns an object with the correct number of properties and with the correct structure", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.article).length).toBe(8);
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("responds with a 400 status code and returns the correct error message when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("responds with a 404 status code and returns the correct error message when passed an id which doesn't exist", () => {
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
