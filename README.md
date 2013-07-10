Drone
=====

Drone is a small, simple remote BDD testing tool designed for target environments.

There are plenty of existing test frameworks and runners out there, but figuring out how to get them working can be a bit of a headache: you may or may not end up wrestling with building, dependencies, bad documentation or simply drowning in too many options, features and jargon. Drone aims to satisfy a core set of requirements, following the KISS and YAGNI mantras:

* Support out-of-the-box testing in target environments, e.g. embedded or virtualized browsers
* Support a minimal set of BDD declarations in a fairly typical style (describe, it, assert, before, beforeEach)
* Minimum mental load configuration or build process
* Remote or console.log based reporting
* Simple async/sync support: functions with a callback parameter are treated as async; functions without aren't

Configuration & Running
-----------------------

1. Include Runner.js
2. Include your test specs (see below for examples)
3. Invoke Runner.run() directly or use a keypress trigger (see bottom of Runner.js for examples)

Example: synchronous test (suited to unit tests)

```
describe("The cat module stores registration numbers", function () {
	var cat = null;
	before(function () {
		cat = Cats.create();
	});

	it('Should store correctly calculated registration numbers', function () {
		cat.save('Bob', 123);
		assert(cat.registration == 'B123');

		cat.save('John', 456);
		assert(cat.registration == 'J456');
	});
});
```

Example: async test (suited to integration tests)

```
describe("Users add products to cart", function () {
	var cart = null;
	var productId = '1234';

	before(function (done) {
		// go to product page
		app.navigate({action: product, id: productId}, done);
	});

	it("should add a product to a cart", function (done) {
		// maybe you can do something like this
		// or maybe you use jQuery to fake an click event on an 'add product' button
		app.clickButton({id: add}, function() {
			// perhaps there's a webservice call in your frontend that
			// calls back when it gets a response
			assert($('#cart_counter').html() == '1');
			assert(app.session.cart.count == 1);
			done();
		});
	});
});
```

