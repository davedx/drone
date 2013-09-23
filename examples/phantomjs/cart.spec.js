describe("Users can add products to cart", function () {
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