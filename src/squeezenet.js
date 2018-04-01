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
    if (typeof imgTag == "function"){
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

SqueezeNet.classify_ = async (imgTag) => {
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
        "<p>Predicted Classes with Confidence:</p>"+"<pre>"+
        JSON.stringify(posterior,null,2)+"</pre>"
    );
    $('#loadingDiv').hide();
}; //jshint ignore: line

module.exports = SqueezeNet;
