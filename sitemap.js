/*
Reads sitemap from specified url, fetches urls, opens them
Checks if title tag exists
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
	viewportSize: {width: 1024, height: 768}
});

var urls = [];

//Start casper by fetching sitemap xml
casper.start(url, function() {
	//Parse sitemap xml
	var parser = new DOMParser();
	var doc = parser.parseFromString(this.getPageContent(), "application/xml");
	
	//Find all loc nodes, and store url inside in array
	var locNodes = doc.querySelectorAll("loc");

	for(var i = 0; i < locNodes.length; i++) {
		urls.push(locNodes[i].childNodes[0].data);
	}

	//Start new batch of tests using urls
	casper.start().each(urls, function(self, url) {
		self.thenOpen(url, function() {
		    this.test.assertExists('title', 'title tag exists');
		});
	});

	casper.run(function() {
		this.test.done();
		this.test.renderResults(true);
	});
});



//Run all steps
casper.run();