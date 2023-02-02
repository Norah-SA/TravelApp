// import {describe, expect} from "@jest/globals";

const request = require("supertest");
const app = require("../src/server/index");

describe("Test the server", () => {
    test("Testing GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});