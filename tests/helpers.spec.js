var expect = require('chai').expect;

describe('Testing Helpers Module', function() {
    var Helpers;

    before(function(){
      this.jsdom = require('jsdom-global')();
      $ = require('jquery');
      Helpers = require('../src/helpers');
    });

    it('Check if all methods of helpers exist', function() {
      expect(Helpers).to.exist;
      expect(Helpers.Network,"Wanted Network").to.exist;
      expect(Helpers.showAlert).to.exist;
      expect(Helpers.Network.showOfflineAlert).to.exist;
    });
    after(function(){
      this.jsdom();
    });
});
