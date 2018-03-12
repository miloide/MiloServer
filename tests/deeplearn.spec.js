var expect = require('chai').expect;
var DeepLearn = require('../src/deeplearn')

describe('Testing DeepLearn module', function() {
  it('Expect DeepLearn.setup to exist', function() {
    expect(DeepLearn.setup,"expected setup").to.exist;
  });
});
