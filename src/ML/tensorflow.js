var tf = require("@tensorflow/tfjs");

const tfOptimizers = {
    "sgd":tf.train.sgd(),
    "adagrad":tf.train.adagrad();
    "adam":tf.train.adam();
    "adamax":tf.train.adamax();
};

const tfConstants = {
    "kernelSize":8,
    "strides":1,
    "activation":"softmax",
    "kernelInitializer":'VarianceScaling',
    "padding": 0,
    "filters": 16,
    "useBias" : false,
    "learningRate" : 0.01,
    "optimizer" : "sgd",
    "loss" : "categoricalCrossentropy",
    "metrics":["accuracy"],
    "batchSize":100,
    "trainBatchSize":.8,
    "testBatchSize":.2,
    "iterations":100,
    "units":10,
    "outputUnits":2,
    "poolSize2d":[2,2],
    "poolSize1d":2,
    "poolStrides":[2,2]
};

function getOptimizer(optimizer, rate){
    var optimizer_ = (optimizer == undefined)? tfOptimizers["sgd"]:tfOptimizers[optimizer];
    var rate_ = (rate == undefined)?tfConstants["rate"]:rate;
    optimizer_.rate = rate_;
    return optimizer_;
}

function getConv2d(inputShape, kernelSize, filters, strides, activation, kernelInitializer){
    if (inputShape == undefined){
        return;
    }
    var kernelSize_ = (kernelSize == (undefined||0))?tfConstants["kernelSize"] : kernelSize;
    var strides_ = (strides == (undefined||0))?tfConstants["strides"] : strides;
    var filters_ = (filters == (undefined||0))?tfConstants["filters"] : filters;
    var activation_ = (activation == (undefined||0))?tfConstants["activation"] : activation;
    var kernelInitializer_ = (kernelInitializer == (undefined||0))?tfConstants["kernelInitializer"] : kernelInitializer;
    var layer = {
        inputShape : inputShape_,
        kernelSize : kernelSize_,
        filters : filters_,
        strides : strides_,
        activation : activation_,
        kernelInitializer : kernelInitializer_
    };

    return tf.layers.conv2d(layer);
};

function getMaxPooling2d(poolSize, poolStrides,type){
    var poolSize_ = (poolSize == (undefined||0))?tfConstants["poolSize"]:poolSize;
    var poolStrides = (poolStrides == (undefined||0))?tfConstants["poolStrides"]:poolStrides;
    var maxPoolingLayer = {
        poolSize : poolSize_,
        strides : poolStrides_
    };
    return tf.layers.maxPooling2d(maxPoolingLayer);
};

function getDenseLayer(units, activation){
    var activation_ = (activation == undefined)? tfConstants["activation"]:activation;
    var units_ = (unit == undefined)?tfConstants["units"]:units;
    var DenseLayer = {
        units : units_,
        kernelInitializer: 'VarianceScaling',
        activation : activation_
    };
    return tf.layers.dense(DenseLayer);
}

function flattenLayer(input){
    if (input!=undefined){
        var flattenLayer = tf.layers.flatten();
        var flatten = flattenLayer.apply(input).shape;
        return flatten;
    }
    else{
        return tf.layers.flatten();
    }
}

function compileModel(optimizer, rate, loss, metrics){
    var optimizer_ = (optimizer == undefined)? tfOptimizers["sgd"]: tfOptimizers[optimizer];
    optimizer_.rate = (rate == undefined)? tfConstants["learningRate"]:rate;
    var loss_ = (loss == undefined)? tfConstants["loss"]:loss;
    var metrics_ = (metrics == undefined)?tfConstants["metrics"]:metrics;
    var compile = {
        optimizer :optimizer_,
        loss : loss_,
        metrics : metrics_
    };
}

function createModel(){
    this.model = tf.sequential();
}

createModel.prototype.addLayers = function(layers){
    for(var index in layers){
        var layer = layers[index];

        if(layer["type"] == "conv2d"){
            this.model.add(getConv2d(layer["inputSize"],layer["kernelSize"],
                          layer["filters"],layer["strides"],layer["activation"]));
        }
        else if(layer["type"] == "maxPool2d"){
            this.model.add(getMaxPooling2d(layer["poolSize"],layer["strides"]));
        }
        else if(layer["type"] == "dense"){
            this.model.add(getDenseLayer(layer["units"], layer["activation"]));
        }
        else if(layer["type"] == "flatten"){
            this.model.add(flattenLayer(layer["input"]));
        }
        else if(layer["type"] == "compile"){
            this.model.compile(compileModel(layer["optimizer"],layer["rate"],layer["loss"],layer["optimizer"]));
        }
    }
}

createModel.prototype.train = function(){

}

