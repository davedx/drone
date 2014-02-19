// driver for karma
var KarmaAdapter = function(karma) {
	this.reporter = karma;
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
		karma.info({
      total: this.asserts.length
    });

		for(var i=0; i<this.asserts.length; i++) {
			karma.result(this.asserts[i]);
		}
		
		// finish
		karma.complete({
      coverage: __coverage__
    });

	}.bind(this);
};
