/**
 * Test module for cache
 */

module('cache', {

    setup : function(){

        this.paper1 = { id: 1 };
        this.paper2 = { id: 2 };
        this.paper3 = { id: 3 };
        this.paper4 = { id: 4 };
        this.paper5 = { id: 5 };

    },
    teardown: function(){

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
    cache.addPaper("forth", this.paper4);
    equal(cache.getPaper("first"), null, "First paper should has been cancelled");
    equal(cache.getPaper("second"), this.paper2, "Search second paper");
    equal(cache.getPaper("third"), this.paper3, "Search third paper");
    equal(cache.getPaper("forth"), this.paper4, "Search forth paper");
    cache.addPaper("fifth", this.paper5);
    equal(cache.getPaper("second"), null, "second paper should has been cancelled");
});