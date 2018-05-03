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

    it('Check toTitleCase', function() {
      var want = "Milo Platform";
      var got = Helpers.toTitleCase("milo platform");
      expect(got).to.equal(want);
    });

    it('Check slugify', function() {
      var test = "   mil0@. Platform   ";
      var want = "mil0-platform";
      var got = Helpers.slugify(test);
      expect(got).to.equal(want);
    });

    it('Expect snackbar to display and handle callback', function(done){

      // Setup
      var snackbarDiv = document.createElement('div');
      snackbarDiv.id="snackbar";
      function checkCallback(){
        expect(snackbarDiv.className).to.equal("dismiss");
        done();
      }
      var message = "Testing snackbar";
      document.body.appendChild(snackbarDiv);
      // Testcase
      Helpers.snackbar(message,checkCallback,50);
      // Validation
      expect(snackbarDiv.className).to.equal("display");
      expect(snackbarDiv.innerHTML).to.equal(message);

    });

    after(function(){
      this.jsdom();
    });
});
