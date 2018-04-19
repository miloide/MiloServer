var WebCam = require('./webcam');
var $ = require('jquery');
/**
 * Cleans up misc_output div, console_javascript div, and other references
 */
function clearOutput(){
    var MediaStream = WebCam.stream;
    if (MediaStream != undefined){
        MediaStream.getAudioTracks().forEach(function(track) {
            track.stop();
        });
        MediaStream.getVideoTracks().forEach(function(track) {
            track.stop();
        });
    }
    WebCam.loaded = false;
    // Clear outputs if any
    document.getElementById("console_javascript").innerHTML="";
    document.getElementById("misc_output").innerHTML="";
    document.getElementById("graph_output").innerHTML="";
    document.getElementById("kmeans").innerHTML="";
    document.getElementById("chart").innerHTML="";
    $("#console_holder").hide();
    $("#drawCanvasDiv").hide();
    $("#loadingDiv").hide();
}

//customize console.log
console.webLog = (function (old_function,div_id) {
    return function (value) {
        //See https://developer.mozilla.org/en-US/docs/Web/API/Console/log
        if ( typeof value == 'string'){
            old_function(value);
            $(div_id).append(
                '<pre class="block">'+
                    value.trim().replace(new RegExp("\\r?\\n\\s+","g"),"\<br\>")+
                '</pre>'
            );
        } else if (typeof value == 'number'){
            old_function(value);
            $(div_id).append('<pre class="block">' + value + '</pre>');
        } else if (value instanceof Promise){
            Promise.resolve(value).then(function(val){
                try {
                    var values = Object.values(JSON.parse(JSON.stringify(val)));
                    if (values.length == 1) {
                        values = values[0];
                    }
                    old_function(JSON.parse(JSON.stringify(values)));
                    $(div_id).append('<pre class="block">' + JSON.stringify(values,null,2) + '</pre>');
                } catch (e){
                    old_function(val);
                    $(div_id).append('<pre class="block">' + val + '</pre>');
                }

            });
        } else {
            old_function(JSON.stringify(value));
            if (JSON.stringify(value).length < 20){
                $(div_id).append('<pre class="block">' + JSON.stringify(value) + '</pre>');
            } else {
                $(div_id).append('<pre class="block">' + JSON.stringify(value,null,2) + '</pre>');
            }
        }
    };
} (console.log.bind(console), "#console_javascript"));

/**
 * Prints a tensorflow tensor by waiting for values to be computed for 500 millis if not yet defined
 * @param {tf.tensor} tensor
 */
console.printTensor = function(tensor){
    if (tensor == undefined){
        console.webLog("Try rerunning this script... some values weren't found.");
    } else {
        console.webLog(tensor.toString().split("values:")[1].trim());
    }
};


/**
 * Console object to JSON Download
 */

console.save = function(data, filename){

    if (!data) {
        console.error('Console.save: No data');
        return;
    }

    if (!filename) {
        filename = 'data.json';
    }

    if (typeof data === "object"){
        data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
 };

module.exports = {
    clearOutput,
};
