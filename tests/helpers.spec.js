var expect = require('chai').expect;
var jsdom = require('mocha-jsdom')

describe('Testing Helpers Module', function() {

    jsdom()

    it('Check if all methods of helpers exist', function() {
      var Helpers = require('../src/helpers');
      expect(Helpers).to.exist;
      expect(Helpers.Network,"Network").to.exist;
      expect(Helpers.showAlert).to.exist;
      expect(Helpers.Network.showOfflineAlert).to.exist;
  });
});