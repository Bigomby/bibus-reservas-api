/* eslint-env node, mocha */

const fs = require('fs');
const request = require('request');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Scraper = require('../../src/scraper/scraper');

const assert = chai.assert;
chai.use(chaiAsPromised);

const expectedData = require('./test_data/parsed_data.json');

const scraper = new Scraper({
  estadoURL: 'http://test',
  loginURL: 'http://test',
  reservaURL: 'http://test',
});

describe('getStatus()', () => {
  before((done) => {
    fs.readFile('./test/scraper/test_data/raw_data.html', { encoding: 'utf-8' },
      (err, data) => {
        if (err) throw err;

        sinon.stub(request, 'get').yields(null, null, data);
        done();
      });
  });

  after(() => request.get.restore());

  it('should get the status of the study rooms returned by the server',
    () => assert.eventually.deepEqual(scraper.getStatus(), expectedData));
});
