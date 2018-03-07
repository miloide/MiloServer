var swal = require('sweetalert');

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
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
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

module.exports = Helpers;
