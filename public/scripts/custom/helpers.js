/**
 * Namespace for internet connections functions,variables
 */
var internetConnection = {};
internetConnection.isOnline = window.navigator.onLine;
internetConnection.showOfflineAlert = function(){
    internetConnection.isOnline = false;
    $('#modalHeader').html("Internet Disconnected");
    $('#modalBody').html("Looks like you arent connected to the internet. Some features may not work as expected!");
    $('#modalAlert').click();

}
internetConnection.showOnlineAlert = function(){
    internetConnection.isOnline = true;
    $('#modalHeader').innerHTML = "Internet Connection Restored";
    $('#modalBody').innerHTML = "Looks like you are back online";
    $('#modalAlert').click();
}
/**
 * Event listeners for window
 */
window.addEventListener("offline", function(e){
    internetConnection.showOfflineAlert();
});

window.addEventListener("online", function(e){
    internetConnection.showOnlineAlert();
});