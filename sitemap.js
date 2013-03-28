/*
Reads sitemap from specified url, fetches urls, opens them
Checks if title tag exists
*/
var url = 'http://www.folkas.com/sitemap';

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
	},
	viewportSize: {width: 1024, height: 768}
});



//Start casper by fetching sitemap xml
casper.start(url, function() {
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
		self.thenOpen(url, function(page) {
			this.test.assertHttpStatus(200, 'url returns 200 OK');
			this.test.assertExists('title', 'title tag exists ' + this);
			this.test.assertTrue(this.getTitle().length > 5, 'title length > 5')
			this.test.assertExists('h1', 'h1 tag exists ' + this);
			this.test.assertExists('meta', 'meta tag(s) exists ' + this);
			this.test.assertExists('meta[name="description"]', 'meta description tag exists ' + this);

			this.test.assertEval(function() {
				return __utils__.findAll('h1').length == 1;
			}, 'only one h1 tag per page ' + this);
			
			this.test.assertEval(function() {
				return __utils__.findOne('meta[name="description"]').getAttribute("name").length <= 160;
			}, 'meta description <= 160 chars ' + this);
			

		});
	});

	casper.run(function() {
		this.test.done();
		this.test.renderResults(true);
	});
});

//Run sitemap step
casper.run();