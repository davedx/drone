// shim for PhantomJS
// see: https://github.com/ariya/phantomjs/issues/10522
Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this;
  return function () {
    return fn.apply(thisp, arguments);
  };
};

var Runner = (function () {
	var reporterFn = Function.prototype.bind.call(console.log, console);
	var concatMessages = true;
	var configuration = {
		asyncTimeout: 2500
	};
	var specs = [];

	var current = 0;
	var specFilter = null;
	var queueIt = [];
	var queueBefore = null;
	var queueBeforeEach = null;
	var queueAfter = null;
	var finished = null;
	var fails = 0;

	var nextTest = function (q) {
		if(q.length === 0)
			return nextSpec();
		var f = q.shift();
		if(f.desc)
			Runner.log('TEST', f.desc);
		if(f.fn.length) {
			var timeout = window.setTimeout(function() { assert('TIMEOUT  ' + f.desc, false); nextTest(q); }, configuration.asyncTimeout);
			f.fn(function () {
				window.clearTimeout(timeout);
				nextTest(q);
			});
		} else {
			f.fn();
			nextTest(q);
		}
	};

	var nextSpec = function () {
		if(specFilter) {
			while(current < specs.length && !specs[current].desc.match(specFilter)) {
				current++;
			}
		}

		if(current === specs.length) {
			Runner.log('FINISHED', fails === 0);
			finished && finished(fails);
			return;
		}
		queueIt = [];
		queueBefore = null;
		queueBeforeEach = null;
		queueAfter = null;
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
		if(queueAfter)
			q.push({fn: queueAfter});
		Runner.log('SPEC', specs[current].desc);
		current++;
		nextTest(q);
	};
	return {
		reporter: function (fn, concat) {
			reporterFn = fn;
			concatMessages = concat;
		},
		log: function () {
			var args = Array.prototype.slice.call(arguments, 0);
			if(concatMessages) {
				var msg = args[1];
				if(args.length === 3)
					msg += (': ' + (args[2] ? 'PASSED' : 'FAILED'));
				reporterFn(msg);
			}	else {
				reporterFn(args);
			}
		},
		configure: function (cfg) {
			configuration = cfg;
		},
		trigger: function (opts) {
			if(opts.keydown && window) {
				window.addEventListener("keydown", function (e) {
					if(e.keyCode === opts.keydown) {
						Runner.run(opts.filter);
					}
				});
			}
		},
		run: function (filter, finishedCallback) {
			Runner.log('START', "**** Starting tests [filter: "+filter+"] ****");
			current = 0;

			finished = finishedCallback;
			specFilter = filter;
			nextSpec();
		},
		countFails: function () {
			fails++;
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
		},
		enqueueAfter: function (fn) {
			queueAfter = fn;
		}
	};
})();

describe = function (desc, fn) {
	Runner.addSpec(desc, fn);
};

xdescribe = function (desc, fn) {};

before = function (fn) {
	Runner.enqueueBefore(fn);
};

beforeEach = function (fn) {
	Runner.enqueueBeforeEach(fn);
};

after = function (fn) {
	Runner.enqueueAfter(fn);
};

it = function (desc, fn) {
	Runner.enqueueIt(desc, fn);
};

xit = function (desc, fn) {};

assert = function (desc, expression) {
	Runner.log('ASSERT', desc, expression);
	//Runner.log(expression, desc);
	if(!expression)
		Runner.countFails();
};
