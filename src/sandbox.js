// Import all dependencies for execution
var Blockly = require('milo-blocks');
var MSG = require('./strings');
var Helpers = require('./helpers');
var Plot = require('./plot');
var Canvas = require('./canvas_');
var WebCam = require('./webcam');
var MobileNet = require('./mobilenet');
var Datasets = require('./datasets');
var Pmf = require('./statistics/pmf');
var Cdf = require('./statistics/cdf');
var regression = require('./ML/regression');
var gaussian = require('./statistics/gaussian');
var exponentialDistribution = require('./statistics/exponentialDistribution');
var tf = require('@tensorflow/tfjs');
var Knn = require('./ML/knn');
var Kmeans = require('./ML/Kmeans');
var VisualizeKmeans = require('./ML/visualizeKmeans');
var visualizeKnn = require('./ML/visualizeKnn');
var neuralNetwork = require('./ML/neuralnet');
var $ = window.$ = require('jquery');

/**
 * Create a NameSpace for Sandboxed Execution
 */
var SandBox = {};


function addToContext(vars, context){
    for (var key in vars) {
        context[key] = vars[key];
    }
    return context;
}


function setupContext(context){
    // Add $ module to execution context
    context['$'] = $;
    // Add Blockly to execution context
    context['Blockly'] = Blockly;
    // Add Plot module to execution context
    context['Plot'] = Plot;
    // Add MobileNet module to execution context
    context['MobileNet'] = MobileNet;
    // Add Datasets module to execution context
    context['Datasets'] = Datasets;
    context['RegExp'] = RegExp;
    // Add tfjs to execution context
    context['tf'] = tf;
    context['Canvas'] = Canvas;
    context['Visualize'] = visualizeKnn;
    context['Knn'] = Knn;
    context['ExponentialDistribution'] = exponentialDistribution;
    context['Math'] = Math;
    context['Kmeans'] = Kmeans;
    context['kMeans'] = VisualizeKmeans;
    // Add all from WebCam module to execution context
    context = addToContext(WebCam,context);
    context = addToContext(neuralNetwork, context);
    // Add all from Pmf module to execution context
    context = addToContext(Pmf,context);
    // Add all from Cdf module to execution context
    context = addToContext(Cdf,context);
    // Add all from regression module to execution context
    context = addToContext(regression, context);
    // Add gaussian module to execution context
    context['gaussian'] = gaussian;
    return context;
}

/**
 * Runs the given code on Milo.
 * @param {string} code Generated JS for execution
 */
SandBox.run = function(code){
    var startTime = Date.now();
    var checkTimeout = function() {
        if (Date.now() > startTime+5000) {
            throw new Error(MSG['timeout']);
        }
        return;
    };

    var context = {
        console: console,
        document: document,
        window: window,
        parseFloat: parseFloat,
        checkTimeout: checkTimeout,
        startTime: startTime,
    };
    context = setupContext(context);
    // Add window variables to context
    context = addToContext(window,context);
    try {
        var executionSandbox = makeSandbox('checkTimeout();\n'+code);
        executionSandbox(context);
    } catch (e){
        console.log(code);
        Helpers.showAlert("Error",MSG['badCode'].replace('%1', e));
        // TODO: Remove before deployment
        console.log(e.stack);
    };
};

const scopeProxies = new WeakMap();

function makeSandbox(src) {
  src = 'with (context) {' + src + '}';
  const code = new Function('context', src);

  return function (context) {
    if (!scopeProxies.has(context)) {
      const scopeProxy = new Proxy(context, {has, get});
      scopeProxies.set(context, scopeProxy);
    }
    return code(scopeProxies.get(context));
  };
}

function has (target, key) {
  return true;
}

function get (target, key) {
//   if (key === Symbol.unscopables) {
//       return undefined;
//   }
  return target[key];
}


module.exports = SandBox;
