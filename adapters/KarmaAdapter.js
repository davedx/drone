// driver for karma
var KarmaAdapter = function(karmaReporter) {
	this.reporter = karmaReporter;
	this.logs = [];
	this.asserts = [];
	var lastDate = new Date();

	this.report = function() {
		var args = arguments[0];
		if(args.length === 0) {
			return;
		}
		if(args[0] === 'ASSERT') {
			this.asserts.push({
				description: args[1],
				suite: [],
				success: args[2],
				log: [],
				time: new Date() - lastDate
			});
			lastDate = new Date();
		} else {
			// if needed
			this.logs.push(args[0]);
		}
	}.bind(this);

	this.finished = function() {
		// send everything to karma
		karmaReporter.start(this.asserts.length);

		for(var i=0; i<this.asserts.length; i++) {
			karmaReporter.result(this.asserts[i]);
		}
		// finish
		karmaReporter.finish();
	}.bind(this);
};
