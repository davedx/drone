var args = require('system').args;

if (args.length != 2) {
  console.log('Please pass webserver URL');
}

var page = new WebPage();
// pass through any console output so you can see test results
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

// hijack alert to indicate tests are all finished
page.onAlert = function (fails) {
	phantom.exit(fails);
};

var killRun = function () {
	console.log("Aborted run due to timeout");
	phantom.exit();
}

// you might need to change this, or pass through the whole URL to your app
var url = args[1] + '/index.html';
console.log('[phantomjs] Loading page: '+url);
 
page.open(encodeURI(url), function(status){
	if (status !== 'success') {
		console.log('[phantomjs] could not retrieve!');
		phantom.exit();
	} else {
		// execute the test runner; spawn an alert box on finished to get results
		page.evaluate(function () {
			Runner.run(null, function (fails) {
				alert(fails);
			});
		});

		// if it times out, chances are there is a JavaScript error on the page, or a resource
		// took too long to load
		setTimeout(function () {
			killRun();
		}, 5000);
	}
});