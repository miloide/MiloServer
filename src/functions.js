var pmf = require('./statistics/pmf');
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
        if (typeof(callback) == "function"){
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
    }

    function videoError(e) {
        WebCam.exists = false;
        // Fail Gracefully
        if (typeof(callback) == "function"){
            imgShow(imgFromURL("media/nocamera.jpg",true));
        }
    }
};

/**
 * Cleans up misc_output div, console_javascript div, and other references
 */
const clearOutput = () => {
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
    $("#console_holder").hide();
    $("#loadingDiv").hide();
}

/**
 * Takes a picture from WebCam and loads it into an <img> tag
 * @returns {HTMLImageElement}
 */
WebCam.image = function(callback){
    if (WebCam.exists == false) {
        // Gracefully fall back to image
        $(WebCam.video).hide();
        imgShow(imgFromURL("media/nocamera.jpg",true));
        return;

    }

    if (WebCam.loaded) {
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
    return imgFromURL(url,true);
};

/**
 * Returns a singleton HTMLCanvasElement
 * @returns {HTMLCanvasElement}
 */
const getImageCanvas = () => {
    var canvas = document.getElementById("ImageCanvas");
    if(canvas == undefined){
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
const imgFromURL = (url,isWebCam) => {
    const w = 227,h = 227;
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
const imgShow = (imgTag) => {
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
        scriptElement.src = "js/squeezenet.js";
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
        // console.log(value);
        if (value instanceof Promise){
            Promise.resolve(value).then(function(val){
                try{
                    var values = Object.values(JSON.parse(JSON.stringify(val)));
                    if (values.length == 1) values = values[0];
                    old_function(JSON.parse(JSON.stringify(values)));
                    $(div_id).append('<pre class="block">' + JSON.stringify(values,null,2) + '</pre>');
                } catch (e){
                    old_function(val);
                    $(div_id).append('<pre class="block">' + val + '</pre>');
                }

            });
        } else {
            old_function(JSON.stringify(value));
            if (JSON.stringify(value).length < 20)
                $(div_id).append('<pre class="block">' + JSON.stringify(value) + '</pre>');
            else
            $(div_id).append('<pre class="block">' + JSON.stringify(value,null,2) + '</pre>');
        }
    };
} (console.log.bind(console), "#console_javascript"));

/**
 * Creates a class for parametric Model(Linear and logistic regression) operations
 * @class
 */


/**
 * Creates a class for Plot operations
 * @class
 *
 */

function Plot() {

    this.div_ = document.createElement("div");
    var divId = Blockly.JavaScript.variableDB_.getDistinctName(
        'plotDiv', Blockly.Variables.NAME_TYPE);
    this.div_.setAttribute("id",divId);
    /**
     * @member {Object[]} data_ stores a list of data objects, each containining x,y  coordinates for plotting
     * Sample Data object:
       var datasetA = {
                x: [1.5, 2.5, 3.5, 4.5, 5.5], // x-coordinates
                y: [4, 1, 7, 1, 4], // y-coordinates
                mode: 'markers',  //Any combination of "lines", "markers", "text" joined with "+" or "none".
                type: 'scatter',  //eg: scatter,histogram,box
                name: 'Line A',
                text: ['A1', 'A2', 'A3', 'A4', 'A5'],
                marker: { symbol: "circle" } // eg: "circle","square","cross","triange","star"
            };
            var datasetB = {...};
        this.data_ = [datasetA,datasetB];
        //produces a single plot with values from A and B in different colors
    */

    this.data_ = [];
    /**
     * @member {object} layout_ stores configuration of plot's title, x,y axis, etc
     */
    this.layout_ = {
        title:'Untitled Plot',
        xaxis:{},
        yaxis:{},
        showlegend:true

    };

    /**
     * canvas_ stores the parent div for plot outputs
     */
    this.canvas_ = document.getElementById("graph_output");
}

/**
 * Add a dataset object to Plot.data_
 * @param {Object} data - object containing dataset and plot parameters for this dataset
 * @param {number[]} data.x - x-axis values as array
 * @param {number[]} data.y - y-axis values as array
 * @param {string} data.type - scatter,or histogram,etc - default is scatter
 * @param {string} data.name - data label
 * @param {string} data.color - color for use while plotting
 * @param {string} data.isLine - whether to draw line through points or not
 */
Plot.prototype.addDataItem = function(data) {
    if(data.x == undefined){
        Helpers.showAlert("Error", "Not enough data to plot!");
        return;
    }
    if (data.type == "scatter") {
        if(data.x == undefined || data.y == undefined)
        {
          Helpers.showAlert("Error", "Not enough data");
          return;
        }
    }
    data.marker["symbol"] = "circle";
    if (data.marker["color"] == "#ffffff") data.marker["color"] = undefined;
    if (data.group != undefined && data.group.length){
        var hist = pmf.makeHistFromList(data.group);
        var keys = hist.dictwrapper.values();
        var key2color = {}
        for (var i in keys) key2color[keys[i]] = i+1;
        var color = [];
        for (var i in data.group) color.push(key2color[data.group[i]]);
        data.marker["color"] = color;
        data.text = data.group;
    }
    if (data.type == "scatter") data.mode = data.isLine?"markers+lines":"markers";
    this.data_.push(data);
    return true;
};

/**
 * Sets the plot title to given string argument
 * @param {string} title
 */
Plot.prototype.setTitle = function(title) {
    this.layout_.title = title;
};

/**
 * Sets the label for X-Axis
 * @param {string} label
 */
Plot.prototype.setXLabel= function(label) {
    this.layout_.xaxis.title = label;
};

/**
 * Sets the label for Y-Axis
 * @param {string} label
 */
Plot.prototype.setYLabel= function(label) {
    this.layout_.yaxis.title = label;
};

/**
 * Displays the plot in UI
 * TODO (arjun): Add checks for ensuring data existence
 */
Plot.prototype.show = function() {
    $(this.canvas_).prepend(this.div_);
    var d3 = Plotly.d3;
    var WIDTH_IN_PERCENT_OF_PARENT = 540;
    var HEIGHT_IN_PERCENT_OF_PARENT = 80;
    const gd3 = d3.select("#"+this.div_.getAttribute("id"))
                .append('div')
                .style({
                    width: WIDTH_IN_PERCENT_OF_PARENT + '%',
                    //height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
                });
    const gd = gd3.node();
    Plotly.newPlot(gd,this.data_, this.layout_);
    gd.setAttribute("style","");
    Plotly.Plots.resize(gd);
    //Add the Plotly div to the canvas
    $("#graph_output").show();
};

/**
 * Sets data for plot
 * @param {Object[]} data
 */
Plot.prototype.setData = function(data){
    for (var index in data){
        this.addDataItem(data[index]);
    }
};

/**
 * Sets options for plot layout
 * @param {Object[]} options
 */
Plot.prototype.setOptions = function(options){
    for (var index in options){
        switch(options[index].type){
            case "plot_title":
                this.setTitle(options[index].value);
                break;
            case "plot_xlabel":
                this.setXLabel(options[index].value);
                break;
            case "plot_ylabel":
                this.setYLabel(options[index].value);
                break;
        }
    }
};

/**
 * Console object to JSON Download
 */

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 };

module.exports = {
    Plot,
    SqueezeNet,
    WebCam,
    imgFromURL,
    imgShow,
    getImageCanvas,
    clearOutput
}