var should = require("should");

var user = {name: 'tj', pets: ['tobi', 'loki', 'jane', 'bandit']};

describe('DummyTest', function () {

    describe('An Array ', function () {
        it('should have a length', function(){
            user.should.have.property('pets').with.lengthOf(4);
        });
        it('should have properties', function(){
            user.should.have.property('name', 'tj');
        });
    })
});