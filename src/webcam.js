/**
 * Create a NameSpace for WebCam Operations
 */

var WebCam = {};
// Holder for HTMLVideoElement
WebCam.video = null;
WebCam.loaded = false;
WebCam.exists = true;


/**
 * Setup Webcam HTML Div and define methods for handling video stream
 */
WebCam.init = function(callback) {
    if (WebCam.loaded){
        if (typeof (callback) == "function"){
            callback(WebCam.capture_());
        }
       return;
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true
        }, handleVideo, videoError);
    }

    function handleVideo(stream) {
        WebCam.exists = true;
        var video = document.querySelector("video");
        if(video == undefined){
            video = document.createElement("video");
            $("#misc_output").prepend(video);
        }

        video.setAttribute("id","videoElement");
        video.setAttribute("autoplay","true");
        WebCam.stream = stream;
        video.src = window.URL.createObjectURL(stream);

        var canvas = getImageCanvas();
        // Get a handle on the 2d context of the canvas element
        var context = canvas.getContext("2d");
        // Define some vars required later
        var w, h;
        WebCam.video = video;
        // Add a listener to wait for the 'loadedmetadata' state so the video's dimensions can be read
        WebCam.video.addEventListener("loadedmetadata", function() {
            WebCam.loaded = true;
            w = 224;
            h = 224;
            canvas.width = w;
            canvas.height = h;
            if (typeof(callback) == "function"){
                setTimeout(function(){
                    callback(WebCam.capture_());
                }, 800);
            }
        }, false);
    }

    function videoError(e) {
        WebCam.exists = false;
        // Fail Gracefully
        if (typeof (callback) == "function"){
            imgShow(imgFromURL("/media/nocamera.jpg",true));
        }
    }
};



/**
 * Takes a picture from WebCam and loads it into an <img> tag
 * @returns {HTMLImageElement}
 */
WebCam.image = function(callback){
    if (WebCam.exists == false) {
        // Gracefully fall back to image
        $(WebCam.video).hide();
        imgShow(imgFromURL("/media/nocamera.jpg",true));
        return;

    }

    if (WebCam.loaded) {
        if (typeof (callback)=="function"){
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
    var w = 224,h = 224;
    // Define the size of the rectangle that will be filled (basically the entire element)
    context.fillRect(0, 0, w, h);
    // Grab the image from the video
    context.drawImage(WebCam.video, 0, 0, w, h);
    var url = canvas.toDataURL();
    return imgFromURL(url,true);
};

/**
 * Returns a singleton HTMLCanvasElement
 * @returns {HTMLCanvasElement}
 */
function getImageCanvas(){
    var canvas = document.getElementById("ImageCanvas");
    if (canvas == undefined){
        canvas = document.createElement("canvas");
        canvas.setAttribute("id","ImageCanvas");
        // canvas.setAttribute("style","dislplay: none");
        $("#misc_output").append(canvas);
    }
    return canvas;
}

/**
 * Create HTMLImageElement from given image resource
 * @param {string} url Url for src attribute of generated <img> tag
 * @returns {HTMLImageElement}
 */
function imgFromURL(url,isWebCam){
    const w = 224,h = 224;
    var img = new Image(w,h);
    img.setAttribute("crossorigin","anonymous");
    img.style="display:none;";
    img.onload = function() {
        $("#misc_output").append(img);
    };
    if(isWebCam != true)
        img.src = "https://cors-anywhere.herokuapp.com/"+url;
    else
        img.src = url;
    return img;
}

/**
 * Render Image on UI
 * @param {HTMLImageElement} <img> tag to render
 */
function imgShow(imgTag){
    $('#loadingDiv').show();
    if (typeof (imgTag)=="function"){
        imgTag(imgShow);
        return;
    }
    imgTag.setAttribute("class","videoframe");
    $(imgTag).show();
    $('#loadingDiv').hide();
}


module.exports = {
    WebCam,
    imgFromURL,
    imgShow,
    getImageCanvas
};
