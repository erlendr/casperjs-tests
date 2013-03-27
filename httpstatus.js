/*
Exits with code 1 if 404 or 500
*/
var url = 'http://brage.no/om-oss/1';
var casper = require('casper').create({
	verbose: true,
	logLevel: "info",
	onError: function(self, m) {   // Any "error" level message will be written
		console.log('FATAL:' + m); // on the console output and PhantomJS will
		self.exit();               // terminate
	},
	pageSettings: {
		loadImages:  false,        // The WebPage instance used by Casper will
		loadPlugins: false         // use these settings
	},
	httpStatusHandlers: {
		404: function(self, resource) {
			this.echo("Resource at " + resource.url + " not found (404)", "COMMENT");
			this.exit(1);
		},
		500: function(self, resource) {
			this.echo("Resource at " + resource.url + " error (500)", "COMMENT");
			this.exit(1);
		}
	},
});

casper.start(url, function() {
	this.echo("Done.");
	this.exit();
});

casper.run();