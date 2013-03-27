/*
Reads sitemap from specified url, fetches urls, opens them
Exits with code 1 if 404 or 500
*/
var url = 'http://www.folkas.com/sitemap';

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
	viewportSize: {width: 1024, height: 768}
});

//Step to fetch sitemap xml
casper.start().then(function() {
	this.open(url, {
		method: 'get'
	});	
});

//Run above step
casper.run(function() {
	//Parse sitemap xml
	var parser = new DOMParser();
	var doc = parser.parseFromString(this.getPageContent(), "application/xml");
	
	//Find all loc nodes, and store url inside in array
	var locNodes = doc.querySelectorAll("loc");
	var urls = [];
	for(var i = 0; i < locNodes.length; i++) {
		urls.push(locNodes[i].childNodes[0].data);
	}

	//Start new batch of tests using urls
	casper.start().each(urls, function(self, url) {
		//Open url, output title
		self.thenOpen(url, function() {
			this.echo(this.getTitle());
		});
	});

	casper.run();
});