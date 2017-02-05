import * as fs from "fs";
import * as request from "request";
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import Scraper from "../../src/scraper/scraper";

const assert = chai.assert;
chai.use(chaiAsPromised);

const fixturesPath = __dirname + "/../../../tests/scraper/fixtures/";
const expectedData = require(fixturesPath + "parsed_data.json");

const scraper = new Scraper({
  estadoURL: "http://test",
  loginURL: "http://test",
  reservaURL: "http://test",
});

describe("getStatus()", () => {
  before((done) => {
    fs.readFile(fixturesPath + "raw_data.html", { encoding: "utf-8" },
      (err, data) => {
        if (err) throw err;

        sinon.stub(request, "get").yields(null, null, data);
        done();
      });
  });

  after(() => request.get.restore());

  it("should get the status of the study rooms returned by the server",
    () => assert.eventually.deepEqual(scraper.getStatus(), expectedData));
});
