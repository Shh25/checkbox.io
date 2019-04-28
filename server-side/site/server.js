const express = require('express');
const bodyParser = require('body-parser');
 
// Use the prom-client module to expose our metrics to Prometheus
const client = require('prom-client');
 
// enable prom-client to expose default application metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
 
// define a custom prefix string for application metrics
collectDefaultMetrics({ prefix: 'my_application:' });
 
// a custom histogram metric which represents the latency
// of each call to our API.
const histogram = new client.Histogram({
  name: 'my_application:hello_duration',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});


			var cors = require('cors'),
                               got = require('got');
                               rp = require('request-promise');
       marqdown = require('./marqdown.js'),

	//routes = require('./routes/designer.js'),
	//votes = require('./routes/live.js'),
	//upload = require('./routes/upload.js'),
	create = require('./routes/create.js'),
	study = require('./routes/study.js'),
	admin = require('./routes/admin.js');

var args = process.argv.slice(2);
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

var whitelist = ['http://chrisparnin.me', 'http://pythontutor.com', 'http://happyface.io', 'http://happyface.io:8003', 'http://happyface.io/hf.html'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};

app.options('/api/study/vote/submit/', cors(corsOptions));

app.post('/api/design/survey', 
	function(req,res)
	{
		console.log(req.body.markdown);
		//var text = marqdown.render( req.query.markdown );
		//var text = marqdown.render( req.body.markdown );

		// start the timer for our custom metric - this returns a function
  		// called later to stop the timer
		const end = histogram.startTimer();
		var text = "";
		var options = {
			method: 'POST',
			uri: `http://${process.env.IP_ADDRESS}:8080/markdown`,
			body: {
					some: 'payload'
			},
			json: true // Automatically stringifies the body to JSON
	};

	rp(options)
    .then(function (parsedBody) {
			text = parsedBody;
    })
    .catch(function (err) {
			console.log(err);
    });

		res.send( {preview: text} );
		  // stop the timer
		 end({ method: request.method, 'status_code': 200 });
	}
);

// expose our metrics at the default URL for Prometheus
app.get('/metrics', (request, response) => {
  response.set('Content-Type', client.register.contentType);
  response.send(client.register.metrics());
});

//app.get('/api/design/survey/all', routes.findAll );
//app.get('/api/design/survey/:id', routes.findById );
//app.get('/api/design/survey/admin/:token', routes.findByToken );

//app.post('/api/design/survey/save', routes.saveSurvey );
//app.post('/api/design/survey/open/', routes.openSurvey );
//app.post('/api/design/survey/close/', routes.closeSurvey );
//app.post('/api/design/survey/notify/', routes.notifyParticipant );


//// ################################
//// Towards general study management.
app.get('/api/study/load/:id', study.loadStudy );
app.get('/api/study/vote/status', study.voteStatus );
app.get('/api/study/status/:id', study.status );

app.get('/api/study/listing', study.listing );

app.post('/api/study/create', create.createStudy );
app.post('/api/study/vote/submit/', cors(corsOptions), study.submitVote );

//// ADMIN ROUTES
app.get('/api/study/admin/:token', admin.loadStudy );
app.get('/api/study/admin/download/:token', admin.download );
app.get('/api/study/admin/assign/:token', admin.assignWinner);

app.post('/api/study/admin/open/', admin.openStudy );
app.post('/api/study/admin/close/', admin.closeStudy );
app.post('/api/study/admin/notify/', admin.notifyParticipant);

//// ################################

//app.post('/api/upload', upload.uploadFile );

// survey listing for studies.
//app.get('/api/design/survey/all/listing', routes.studyListing );

// Download
//app.get('/api/design/survey/vote/download/:token', votes.download );
// Winner
//app.get('/api/design/survey/winner/:token', votes.pickParticipant );

// Voting
//app.get('/api/design/survey/vote/all', votes.findAll );
//app.post('/api/design/survey/vote/cast', votes.castVote );
//app.get('/api/design/survey/vote/status', votes.status );
//app.get('/api/design/survey/vote/stat/:id', votes.getSurveyStats );



// var appPort = process.env.APP_PORT;
// app.listen(port);
// console.log(`Listening on port ${port}...`);

function start() 
{
	return new Promise(function(resolve, reject)
	{
		server = app.listen(process.env.APP_PORT, function () {

			var host = server.address().address
			var port = server.address().port

			console.log('Example app listening at http://%s:%s', host, port)
			resolve({host: host, port: port});
		}).on('error', function (err) {
			if(err.errno === 'EADDRINUSE') {
				console.log(`----- Port ${port} is busy, try with another port`);
			} else {
				console.log(err);
			}
		});
	});
}

function stop() 
{
	return server.close();
}

(async () => {
	if( args[0] === "start" )
	{
		await start();
	}
})();

module.exports = { start: start, stop: stop };
