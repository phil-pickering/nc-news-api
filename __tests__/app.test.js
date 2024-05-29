const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const e = require("express");

beforeEach(() => {
  console.log("Seeding");
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/notARoute", () => {
  it("responds with a 404 status code", () => {
    return request(app).get("/api/notARoute").expect(404);
  });
  it("returns the correct error message", () => {
    return request(app)
      .get("/api/notARoute")
      .then(({ body }) => {
        expect(body.msg).toBe("Route does not exist");
      });
  });
});

describe("GET /api/topics", () => {
  it("responds with a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  it("returns the correct number of results", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
      });
  });
  it("returns the correct structure for each result", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
