const assert = require('assert');
const expect = require('chai').expect;
const server = require('../server')
const got   = require('got');

describe('main', function() {
    describe('#start()', function() {
      it('should start server on port 9001', async () => {

          await server.start();

          const response = await got('http://localhost:9001/api/study/listing', {timeout:500})
          // Stop server
          await main.stop();
          expect(response.statusCode).to.equal(200);
      });
    });
  });