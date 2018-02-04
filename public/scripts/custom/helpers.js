/**
 * Namespace for internet connections functions,variables
 */
var internetConnection = {};
internetConnection.isOnline = window.navigator.onLine;
internetConnection.showOfflineAlert = function(){
    internetConnection.isOnline = false;
    $('#alertHeader').html("Internet Disconnected");
    $('#alertBody').html("Looks like you arent connected to the internet.<br>Some features may not work as expected!");
    $('#alertModalTrigger').click();

};

internetConnection.showOnlineAlert = function(){
    internetConnection.isOnline = true;
    $('#alertHeader').html("Internet Connection Restored");
    $('#alertBody').html("You are back online!<br>Everything should work fine now.");
    $('#alertModalTrigger').click();
};

/**
 * Event listeners for window
 */
window.addEventListener("offline", function(e){
    internetConnection.showOfflineAlert();
});

window.addEventListener("online", function(e){
    internetConnection.showOnlineAlert();
});