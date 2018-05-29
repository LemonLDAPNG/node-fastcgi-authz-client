var assert = require('assert');

describe('Simple load', function() {
  it('should load library', function() {
    var f = require('../');
    assert.equal(typeof f, 'function');
  });
});
