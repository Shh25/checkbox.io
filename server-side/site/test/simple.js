const assert = require('assert');
const expect = require('chai').expect;
const server = require('../server')
const got   = require('got');

describe('main', function() {
    describe('#start()', function() {
      it('should start server on port 9001', async () => {
          process.env['APP_PORT'] = 9001
          // other environment variables are same as development server in environment variables
          await server.start();

          const response = await got('http://localhost:9001/api/study/listing', {timeout:500})
          // Stop server
          await server.stop();
          expect(response.statusCode).to.equal(200);
      });

			it('should start server on port 9001', async () => {
				process.env['APP_PORT'] = 9001

				await server.start();

				const response = await got.post('http://localhost:9001/api/study/create', 
				{
					json: true,
					data: {
						name: 'demo-survey',
						description: 'test if survey creation is working',
						invitecode: 'RESEARCH',
						studyKind: 'dataStudy'
					}
				});
				// Stop server
				await server.stop();
				expect(response.statusCode).to.equal(200);
			});
			done();
		});
  });