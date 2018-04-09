var swal = require('sweetalert');
var $ = require('jquery');

/**
 * Namespace for all helper functions
 */
 var Helpers = {};
 /**
 * Function for setting custom dialog body and header
*/
Helpers.showAlert = function(header, body,type="info"){
    swal(header,body,type);
};

Helpers.generateHash = function(str){
    var hash = 0, i, chr;
    if (this.length === 0) {return hash;}
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
};

Helpers.snackbar = function(message,callback,timer) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    // Add the "display" class to DIV
    x.className = "display";

    // After 2 seconds, remove the show class from DIV
    setTimeout(function(){
         x.className = x.className.replace("display", "dismiss");
         if (callback){
            callback();
         }
    }, timer || 1500);
};

/**
 * Namespace for Network functions,variables
 */
Helpers.Network = {};
Helpers.Network.isOnline = window.navigator.onLine;
Helpers.Network.showOfflineAlert = function(){
    Helpers.Network.isOnline = false;
    Helpers.showAlert("Internet Disconnected", "Looks like you arent connected to the internet.\nSome features may not work as expected!","warning");
};

Helpers.Network.showOnlineAlert = function(){
    Helpers.Network.isOnline = true;
    Helpers.showAlert("You are back online!", "Everything should work fine now.");
};


/**
 * Event listeners for window
 */
window.addEventListener("offline", function(e){
    Helpers.Network.showOfflineAlert();
});

window.addEventListener("online", function(e){
    Helpers.Network.showOnlineAlert();
});

Helpers.sidebarInit = function(canModify, project){
    if (project.pages){
        var pages = typeof project.pages == 'string'?JSON.parse(project.pages):project.pages;
        var markdownPages = typeof project.markdownPages == 'string'?JSON.parse(project.markdownPages):project.markdownPages;
        var elem = angular.element($("#sidebar"));
        var injector = elem.injector();
        var $rootScope = injector.get('$rootScope');
        $rootScope.$apply(function(){
            $rootScope.canModify = canModify;
            $rootScope.pages = pages;
            $rootScope.markdownPages = markdownPages;
        });
    }
};




module.exports = Helpers;
