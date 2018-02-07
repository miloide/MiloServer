/**
 * Namespace for all helper functions
 */
 var helpers = {};
 /** 
 * Function for setting custom dialog body and header
*/
helpers.showAlert = function(header, body){
    $('#alertHeader').html(header);
    $('#alertBody').html(body);
    $('#alertModalTrigger').click();
}

/**
 * Namespace for Network functions,variables
 */
helpers.network = {};
helpers.network.isOnline = window.navigator.onLine;
helpers.network.showOfflineAlert = function(){
    helpers.network.isOnline = false;
    helpers.showAlert("Internet Disconnected", "Looks like you arent connected to the internet.<br>Some features may not work as expected!" );
};

helpers.network.showOnlineAlert = function(){
    helpers.network.isOnline = true;
    helpers.showAlert("Internet Connection Restored", "You are back online!<br>Everything should work fine now.");
};
/**
 * Event listeners for window
 */
window.addEventListener("offline", function(e){
    helpers.network.showOfflineAlert();
});

window.addEventListener("online", function(e){
    helpers.network.showOnlineAlert();
});