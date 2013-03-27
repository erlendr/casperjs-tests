var url = 'http://brage.no/om-oss/';
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
	}
});

casper.start(url, function() {
	this.test.assert(this.getCurrentUrl() === url, 'url is the one expected');
});

casper.then(function() {
	this.capture('brage.png', {
        top: 100,
        left: 100,
        width: 500,
        height: 400
    });
});

casper.run();