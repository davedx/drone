Runner = (function () {
	var reporterFn = console.debug.bind(console);
	var specs = [];

	var current = 0;
	var specFilter = null;
	var queueIt = [];
	var queueBefore = null;
	var queueBeforeEach = null;

	var nextTest = function (q) {
		if(q.length == 0)
			return nextSpec();
		var f = q.shift();
		if(f.desc)
			reporterFn(f.desc);
		if(f.fn.length) {
			f.fn(function () {
				nextTest(q);
			});
		} else {
			f.fn();
			nextTest(q);
		}
	}

	var nextSpec = function () {
		if(specFilter) {
			while(current < specs.length && !specs[current].desc.match(specFilter)) {
				current++;
			}
		}

		if(current == specs.length) {
			return;
		}
		queueIt = [];
		queueBefore = null;
		queueBeforeEach = null;
		specs[current].fn();
		// build full queue:
		var q = [];
		if(queueBefore)
			q.push({fn: queueBefore});
		for(var i in queueIt) {
			if(queueBeforeEach)
				q.push({fn: queueBeforeEach});
			q.push(queueIt[i]);
		}
		reporterFn(specs[current].desc);
		current++;
		nextTest(q);
	};
	return {
		reporter: function (fn) {
			reporterFn = fn;
		},
		log: function (msg) {
			reporterFn(msg);
		},
		trigger: function (opts) {
			if(opts.keydown && window) {
				window.onload = function() {
				    window.addEventListener("keydown", function (e) {
				    	if(e.keyCode == opts.keydown)
				    		Runner.run(opts.filter);
				    });
				}
			}
		},
		run: function (filter) {
			reporterFn("Starting tests with filter: "+filter);
			current = 0;
			specFilter = filter;
			nextSpec();
		},
		addSpec: function (desc, fn) {
			specs.push({fn: fn, desc: desc});
		},
		enqueueIt: function (desc, fn) {
			queueIt.push({fn: fn, desc: desc});
		},
		enqueueBefore: function (fn) {
			queueBefore = fn;
		},
		enqueueBeforeEach: function (fn) {
			queueBeforeEach = fn;
		}
	}
})();

describe = function (desc, fn) {
	Runner.addSpec(desc, fn);
}

xdescribe = function (desc, fn) {}

before = function (fn) {
	Runner.enqueueBefore(fn);
}

beforeEach = function (fn) {
	Runner.enqueueBeforeEach(fn);
}

it = function (desc, fn) {
	Runner.enqueueIt(desc, fn);
}

xit = function (desc, fn) {}

assert = function (expression) {
	if(expression) {
		Runner.log("#### PASS");
	} else {
		Runner.log("#### FAIL");
	}
}

/**
 * Setup example:
 *
 * Runner.reporter(MyCustomReportingFunction);
 * Runner.trigger({keydown: 84}); // 't'
 *
 */