/**
 * Create a NameSpace for WebCam Operations
 */
var WebCam = {};

// Holder for HTMLVideoElement
WebCam.video = null;
WebCam.loaded = false;

/**
 * Setup Webcam HTML Div and define methods for handling video stream
 */
WebCam.init = function(callback) {
    if (WebCam.loaded){
        if (typeof(callback) == "function"){
            callback(WebCam.capture_());
        }
       return;
    }

    var video = document.querySelector("video");
    if(video == undefined){
        video = document.createElement("video");
        $("#misc_javascript").prepend(video);
    }
    video.setAttribute("id","videoElement");
    video.setAttribute("autoplay","true");


    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true
        }, handleVideo, videoError);
    }

    function handleVideo(stream) {
        WebCam.stream = stream;
        video.src = window.URL.createObjectURL(stream);
    }

    function videoError(e) {
        // do something
    }

    // Get handles on the video and canvas elements
    video = document.querySelector("video");
    var canvas = getImageCanvas();
    // Get a handle on the 2d context of the canvas element
    var context = canvas.getContext("2d");
    // Define some vars required later
    var w, h;
    WebCam.video = video;
    // Add a listener to wait for the 'loadedmetadata' state so the video's dimensions can be read
    WebCam.video.addEventListener("loadedmetadata", function() {
        WebCam.loaded = true;
        w = 227;
        h = 227;
        canvas.width = w;
        canvas.height = h;
        if (typeof(callback) == "function"){
            setTimeout(function(){
                callback(WebCam.capture_());
            }, 800);

        }
    }, false);
};

/**
 * Cleans up misc_javascript div, console_javascript div, and other references
 */
function clearOutput() {
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
    $("#console_holder").hide();
    $("#loadingDiv").hide();
    document.getElementById("misc_javascript").innerHTML="";
    document.getElementById("graph_javascript").innerHTML="";
}

/**
 * Takes a picture from WebCam and loads it into an <img> tag
 * @returns {HTMLImageElement}
 */
WebCam.image = function(callback){
    if(WebCam.loaded) {
        if(typeof(callback)=="function"){
            callback(WebCam.capture_());
        } else {
            return WebCam.capture_();
        }
    } else {
        WebCam.init(callback);
    }

};

/**
 * Helper method for capture
 * @returns {HTMLImageElement}
 */
WebCam.capture_ = function(){
    var canvas = getImageCanvas();
    var context =  canvas.getContext("2d");
    const w = 227,h = 227;
    // Define the size of the rectangle that will be filled (basically the entire element)
    context.fillRect(0, 0, w, h);
    // Grab the image from the video
    context.drawImage(WebCam.video, 0, 0, w, h);
    const url = canvas.toDataURL();
    return imgFromURL(url);
};

/**
 * Returns a singleton HTMLCanvasElement
 * @returns {HTMLCanvasElement}
 */
function getImageCanvas(){
    var canvas = document.getElementById("ImageCanvas");
    if(canvas == undefined){
        canvas = document.createElement("canvas");
        canvas.setAttribute("id","ImageCanvas");
        // canvas.setAttribute("style","dislplay: none");
        $("#misc_javascript").append(canvas);
    }
    return canvas;
}

/**
 * Create HTMLImageElement from given image resource
 * @param {string} url Url for src attribute of generated <img> tag
 * @returns {HTMLImageElement}
 */
function imgFromURL(url){
    const w = 227,h = 227;
    var img = new Image(w,h);
    img.crossOrigin = "Anonymous";
    img.style="display:none;";
    img.onload = function() {
        $("#misc_javascript").append(img);
    };
    img.src = url;
    return img;
}

/**
 * Render Image on UI
 * @param {HTMLImageElement} <img> tag to render
 */
function imgShow(imgTag){
    $('#loadingDiv').show();
    if(typeof(imgTag)=="function"){
        imgTag(imgShow);
        return;
    }
    imgTag.setAttribute("class","videoframe");
    $(imgTag).show();
    $('#loadingDiv').hide();
}



/**
 * Create a NameSpace for SqueezeNet Model.
 */
var SqueezeNet = {};

SqueezeNet.loaded = false;

/**
 * Imports deeplearn-squeezenet from unpkg &
 * classifies a given image in <img> tag using squeezeNet.
 * @param {HTMLImageElement} imgTag HTML <img> tag with loaded image for classification
 */
SqueezeNet.classify = function(imgTag){
    $('#loadingDiv').show();
    if(typeof(imgTag)=="function"){
        imgTag(SqueezeNet.classify);
        return;
    }
    if (!SqueezeNet.loaded) {
        var scriptElement = document.createElement("script");
        scriptElement.setAttribute("id","snetScript");
        //scriptElement.src = "https://unpkg.com/deeplearn-squeezenet";
        scriptElement.src = "scripts/squeezenet.js";
        scriptElement.onload = function () {
            SqueezeNet.loaded = true;
            SqueezeNet.classify_(imgTag);
        };
        document.head.appendChild(scriptElement);
    } else {
        SqueezeNet.classify_(imgTag);
    }
};


/**
 * Using squeezenet calculate class probabilities and predicted class labels to console.
 * @param {HTMLImageElement} imgTag HTML <img> tag with loaded image for classification
 * @private
 */
SqueezeNet.classify_ = async function(imgTag) {  // jshint ignore:line
    const math = new dl.NDArrayMath('webgl', dl.safeMode);
    // squeezenet is loaded from https://unpkg.com/deeplearn-squeezenet
    const squeezeNet = new squeezenet.SqueezeNet(math);
    await squeezeNet.load(); // jshint ignore:line
    // Load the image into an NDArray from the HTMLImageElement.
    const image = dl.Array3D.fromPixels(imgTag);
    imgTag.setAttribute("class","videoframe");
    $(imgTag).show();
    // Predict through SqueezeNet.
    const logits = squeezeNet.predict(image);
    // Convert the logits to a map of class to probability of the class.
    const posterior = await squeezeNet.getTopKClasses(logits, 10);  // jshint ignore:line
    for (const className in posterior) {
        posterior[className] = posterior[className].toFixed(5)*100+"%";
    }
    $(imgTag).after(
        "<p>Predicted Classes with Confidence:</p>"+"<pre>"+JSON.stringify(posterior,null,2)+"</pre>"
    );
    $('#loadingDiv').hide();
}; //jshint ignore: line


//customize console.log
console.webLog = (function (old_function,div_id) {
    return function (value) {
        //See https://developer.mozilla.org/en-US/docs/Web/API/Console/log
        Promise.resolve(value).then(function(val){
            old_function(JSON.parse(JSON.stringify(val)));
            $(div_id).append('<pre class="block">' + JSON.stringify(val,null,2) + '</pre>');
        });
    };
} (console.log.bind(console), "#console_javascript"));
