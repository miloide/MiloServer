// Import all dependencies for execution
var Blockly = require('milo-blocks');
var MSG = require('./strings');
var Helpers = require('./helpers');
var Plot = require('./plot');
var WebCam = require('./webcam');
var SqueezeNet = require('./squeezenet');
var Datasets = require('./datasets');
var DeepLearn = require('./deeplearn');
var Pmf = require('./statistics/pmf');
var Cdf = require('./statistics/cdf');
var gaussian = require('./statistics/gaussian');
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
    // Add SqueezeNet module to execution context
    context['SqueezeNet'] = SqueezeNet;
    // Add Datasets module to execution context
    context['Datasets'] = Datasets;
    // Add DeepLearn module to execution context
    context['DeepLearn'] = DeepLearn;
    // Add all from WebCam module to execution context
    context = addToContext(WebCam,context);
    // Add all from Pmf module to execution context
    context = addToContext(Pmf,context);
    // Add all from Cdf module to execution context
    context = addToContext(Cdf,context);
    // Add gaussian module to execution context
    context['gaussian'] = gaussian;
    return context;
}

/**
 * Runs the given code on Milo.
 * @param {string} code Generated JS for execution
 */
SandBox.run = function(code){
    Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
	var timeouts = 0;
	var checkTimeout = function() {
		if (timeouts++ > 1000000) {
			throw MSG['timeout'];
		}
    };

    var context = {
        console: console,
        document: document,
        window: window,
        parseFloat: parseFloat,
        checkTimeout: checkTimeout
    };
    context = setupContext(context);
    // Add window variables to context
    context = addToContext(window,context);
    var setup =  DeepLearn.setup;
    var jscode = setup + code;
    try {
        var executionSandbox = makeSandbox(jscode);
        executionSandbox(context);
    } catch (e){
        console.log(jscode);
        Helpers.showAlert("Error",MSG['badCode'].replace('%1', e));
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
