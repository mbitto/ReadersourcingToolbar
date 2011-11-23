module('Publisher.subscribe', {
    setup: function(){

        this.type1 = "typeOfSubscription1";
        this.type2 = "typeOfSubscription2";

    },
    teardown: function(){
        
    }
});


test('Subscribe a function and publish', function(){

    var publisher = new MBJSL.Publisher();

    var spyFunction1 = sinon.spy();

    publisher.subscribe(spyFunction1, this.type1);


    publisher.publish(this.type1);
    ok(spyFunction1.calledWith(), "Function called without arguments");

    publisher.publish(this.type1, "test1");
    ok(spyFunction1.calledWith("test1"), "Function called with 'test1' argument");

    publisher.publish(this.type1, ["test1", "test2"]);
    ok(spyFunction1.calledWith(["test1", "test2"]), "Function called with 'test1' and 'test2' arguments");

});


test('Subscribe a function to multiple types of subscriptions', function(){

    var publisher = new MBJSL.Publisher();

    var spyFunction1 = sinon.spy();
    var spyFunction2 = sinon.spy();

    publisher.subscribe(spyFunction1, this.type1);
    publisher.subscribe(spyFunction2, this.type1);
    publisher.subscribe(spyFunction2, this.type2);
    
    publisher.publish(this.type1);
    ok(spyFunction1.calledWith(), "Function1 called without arguments");
    ok(spyFunction2.calledWith(), "Function2 called without arguments");

    publisher.publish(this.type2, "test1");
    ok(spyFunction2.calledWith("test1"), "Function1 called with 'test1' argument");

});


test('Subscribe a function without specifying type', function(){

    var publisher = new MBJSL.Publisher();

    var spyFunction1 = sinon.spy();

    publisher.subscribe(spyFunction1);

    publisher.publish(null, 'test1');

    ok(spyFunction1.calledWith('test1'), "Function1 called without 'test1");

    publisher.publish(null, 'test2');
    ok(spyFunction1.calledWith('test2'), "Function1 called without 'test2");

    publisher.publish(null, ["test1", "test2"]);
    ok(spyFunction1.calledWith(["test1", "test2"]), "Function1 called with 'test1' and 'test2' arguments");

});


test('Subscribe a function to ALL types', function(){

    var publisher = new MBJSL.Publisher();

    var spyFunction1 = sinon.spy();

    publisher.subscribe(spyFunction1, 'ALL');

    publisher.publish(null, 'test1');
    ok(spyFunction1.calledWith('test1'), "Function1 called without 'test1");

    publisher.publish(null, ['test2', 'test3']);
    ok(spyFunction1.calledWith(["test2", "test3"]), "Function1 called with 'test2' and 'test3' arguments");

});