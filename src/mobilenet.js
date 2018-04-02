/**
 * Create a NameSpace for MobileNet Model.
 */
var tf = require('@tensorflow/tfjs');
var MobileNet = {};
var mobileNet_classes = require('./imagenet');
MobileNet.loaded = false;
MobileNet.MODEL_PATH = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
MobileNet.IMAGE_SIZE = 224;
MobileNet.TOPK_PREDICTIONS = 10;


/**
 * Imports mobilenet model &
 * classifies a given image in <img> tag
 * @param {HTMLImageElement} imgTag HTML <img> tag with loaded image for classification
 */
MobileNet.classify = function(imgTag){
    $('#loadingDiv').show();
    if (typeof imgTag == "function"){
        imgTag(MobileNet.classify);
        return;
    }
    MobileNet.classify_(imgTag);
    window.MobileNet = this;
};


/**
 * Using mobilenet calculate class probabilities and predicted class labels to webConsole.
 * @param {HTMLImageElement} imgTag HTML <img> tag with loaded image for classification
 * @private
 */

MobileNet.classify_ = async (imgElement) => {
    //loads mobilenet model from google storage.
    var mobilenet = await tf.loadModel(MobileNet.MODEL_PATH);
    // Warmup the model. This isn't necessary, but makes the first prediction
    // faster. Call `dispose` to release the WebGL memory allocated for the return
    // value of `predict`.
    //await mobilenet.predict(tf.zeros([1, this.IMAGE_SIZE, this.IMAGE_SIZE, 3])).dispose();
    const logits = await tf.tidy(() => {
        // tf.fromPixels() returns a Tensor from an image element.
        const img = tf.fromPixels(imgElement).toFloat();
        const offset = tf.scalar(127.5);
        // Normalize the image from [0, 255] to [-1, 1].
        const normalized = img.sub(offset).div(offset);
        // Reshape to a single-element batch so we can pass it to predict.
        const batched = normalized.reshape([1, 224, 224, 3]);
        // Make a prediction through mobilenet.
        return mobilenet.predict(batched);
    });
    imgElement.setAttribute("class","videoframe");
    $(imgElement).show();
    // Convert logits to probabilities and class names.
    const classes = await getTopKClasses(logits, 10);
    result = {};
    for (var i in classes) {
        result[classes[i].className] = classes[i].probability.toFixed(5)*100+"%";
    }


    $(imgElement).after(
        "<p>Predicted Classes with Confidence:</p>"+"<pre>"+
        JSON.stringify(result,null,2)+"</pre>"
    );

    $('#loadingDiv').hide();
}; //jshint ignore: line


/**
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param logits Tensor representing the logits from MobileNet.
 * @param topK The number of top predictions to show.
 */
async function getTopKClasses(logits, topK) {
  const values = await logits.data();

  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({value: values[i], index: i});
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });
  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      className: mobileNet_classes[topkIndices[i]],
      probability: topkValues[i]
    })
  }
  return topClassesAndProbs;
}
module.exports = MobileNet;
