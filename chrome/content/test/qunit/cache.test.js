/**
 * Test module for cache
 */

module('cache', {

    setup : function(){

        this.paper1 = { name: "first", id: 1 };
        this.paper2 = { name: "second", id: 2 };
        this.paper3 = { name: "third", id: 3 };
        this.paper4 = { name: "fourth", id: 4 };
        this.paper5 = { name: "fifth", id: 5 };

        this.clock = sinon.useFakeTimers();

    },
    teardown: function(){
        this.clock.restore();
    }
});


test('Test main object functionalities', function(){

    var cache = RSETB.cache();

    cache.setMaxPaperInCache(3);
    cache.addPaper("first", this.paper1);
    cache.addPaper("second", this.paper2);
    cache.addPaper("third", this.paper3);
    equal(cache.getPaper("first"), this.paper1, "Search first paper");
    equal(cache.getPaper("second"), this.paper2, "Search second paper");
    cache.addPaper("second", this.paper2);
    cache.addPaper("second", this.paper2);
    cache.addPaper("second", this.paper2);
    equal(cache.getPaper("first"), this.paper1, "Search first paper");
    equal(cache.getPaper("third"), this.paper3, "Search third paper");
    equal(cache.getPaper("niet"), null, "Search nonexistent paper");
    cache.addPaper("fourth", this.paper4);
    equal(cache.getPaper("first"), null, "First paper should has been cancelled");
    equal(cache.getPaper("second"), this.paper2, "Search second paper");
    equal(cache.getPaper("third"), this.paper3, "Search third paper");
    equal(cache.getPaper("fourth"), this.paper4, "Search fourth paper");
    cache.addPaper("fifth", this.paper5);
    equal(cache.getPaper("second"), null, "second paper should has been cancelled");
    cache.setPaperRated("fourth");
    ok(!cache.isPaperRated("third"), "third is not rated");
    ok(cache.isPaperRated("fourth"), "fourth is rated");
    ok(cache.isPaperInCache("third"), "paper should be in cache");
    ok(!cache.isPaperInCache("first"), "paper shouldn't be in cache");
    ok(!cache.isPaperInCache("sixth"), "paper shouldn't be in cache");
    this.clock.tick(60*60*1000);
    ok(!cache.isPaperInCache("third"), "paper shouldn't be in cache");
    ok(!cache.isPaperInCache("fourth"), "paper shouldn't be in cache");

});