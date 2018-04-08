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

Helpers.paginationHandler = function(){
    // store pagination container so we only select it once
    var $paginationContainer = $(".pagination-container"),
        $pagination = $paginationContainer.find('.pagination');

    // click event
    $pagination.find("li a").on('click.pageChange',function(e){
        e.preventDefault();
        // get parent li's data-page attribute and current page
        var parentLiPage = $(this).parent('li').data("page"),
            currentPage = parseInt( $(".pagination-container div[data-page]:visible").data('page') ),
            numPages = $paginationContainer.find("div[data-page]").length;

        // make sure they aren't clicking the current page
        if ( parseInt(parentLiPage) !== parseInt(currentPage) ) {
            // hide the current page
            $paginationContainer.find("div[data-page]:visible").hide();
            $(".pagination").find("li.active").removeClass("active");

            if ( parentLiPage === '+' ) {
                // next page
                $paginationContainer.find("div[data-page="+( currentPage+1>numPages ? numPages : currentPage+1 )+"]").show();
                $pagination.find("li[data-page="+( currentPage+1>numPages ? numPages : currentPage+1 )+"]").addClass("active");
            } else if ( parentLiPage === '-' ) {
                // previous page
                $paginationContainer.find("div[data-page="+( currentPage-1<1 ? 1 : currentPage-1 )+"]").show();
                $pagination.find("li[data-page="+( currentPage-1<1 ? 1 : currentPage-1 )+"]").addClass("active");
            } else {
                // specific page
                $paginationContainer.find("div[data-page="+parseInt(parentLiPage)+"]").show();
                $(this).parent('li').addClass("active");
            }

        }
    });
};




module.exports = Helpers;
