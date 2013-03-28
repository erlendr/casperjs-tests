/*
HTTP status 200 test 
*/

//Url to test
var url = "http://brage.no/bedrift/";

//Init casper
var casper = require('casper').create({
	verbose: false,
	logLevel: "info",
	onError: function(self, m) {   // Any "error" level message will be written
		console.log('FATAL:' + m); // on the console output and PhantomJS will
		self.exit();               // terminate
	},
	pageSettings: {
		loadImages:  false,        // The WebPage instance used by Casper will
		loadPlugins: false         // use these settings
	}
});

//Start casper using specified url
casper.start(url);

//HTTP 200 status test
var httpStatus = function() {
	this.test.assertHttpStatus(200, 'url returns 200 OK');	
};

//Add navigation step
casper.then(httpStatus);

//Run all steps
casper.run(function() {
	//All steps complete

	//Set test done
	this.test.done();

	//Render results to console
	this.test.renderResults(true, 0);
});