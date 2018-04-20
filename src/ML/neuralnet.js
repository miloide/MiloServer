var tf = require("@tensorflow/tfjs");
var Pmf = require('../statistics/pmf');
const tfOptimizers = {
    "sgd":tf.train.sgd(),
    "adagrad":tf.train.adagrad(),
    "adam":tf.train.adam(),
    "adamax":tf.train.adamax()
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
    "loss" : "categoricalCrossEntropy",
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
    optimizer_.learningRate = rate_;
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

function getDenseLayer(units, activation, shape){
    var units_ = (units == undefined)?tfConstants["units"]:units;
    var DenseLayer = {
        units : units_,
        kernelInitializer: 'VarianceScaling',
        activation : activation
    };
    if (shape!=0){
        DenseLayer.inputShape = shape;
    }
    return tf.layers.dense(DenseLayer);
}

function flattenLayer(input){
    if (input!=undefined){
        var flattenLayer = tf.layers.flatten();
        var flatten = flattenLayer.apply(input).shape;
        return flatten;
    }
    else {
        return tf.layers.flatten();
    }
}

function NeuralNetwork(numberFeature, layers, options){
    // Creates tensorflow neural network model
    this.model = tf.sequential();
    this.lossValues = [];
    this.accuracyValues = [];
    this.inputShape = numberFeature;
    //Defines the layers to be added to the model
    this.layers = layers;
    this.addLayers();
    //Default options to compile neural network
    this.options = {
        optimizer : getOptimizer(tfConstants["optimizer"], tfConstants["rate"]),
        loss : 'meanSquaredError',
        metrics : ['accuracy']
    };
    if (options!=undefined){
        this.setOptions(options);
    }
}


NeuralNetwork.prototype.addLayers = function(){
    this.layers[0].inputShape = this.inputShape;
    for (var index = 0;index < this.layers.length; index++){
        var layer = this.layers[index];
        if (layer["type"] == "conv2d"){
            this.model.add(getConv2d(layer["inputSize"],layer["kernelSize"],
                          layer["filters"],layer["strides"],layer["activation"]));
        }
        else if (layer["type"] == "maxPool2d"){
            this.model.add(getMaxPooling2d(layer["poolSize"],layer["strides"]));
        }
        else if (layer["type"] == "dense"){
            this.model.add(getDenseLayer(layer["units"], layer["activation"],layer["inputShape"]));
        }
        else if (layer["type"] == "flatten"){
            this.model.add(flattenLayer(layer["input"]));
        }
    }
    return this.model;
};

NeuralNetwork.prototype.setOptimizer = function(optimizer, rate){
    var optimizer = getOptimizer(optimizer, rate);
    this.options.optimizer = optimizer;
};

NeuralNetwork.prototype.setLoss = function(lossFunction){
    this.options.loss = lossFunction;
};

NeuralNetwork.prototype.setMetrics = function(metrics){
    this.options.metrics = [metrics];
};

NeuralNetwork.prototype.setOptions = function(options){
    for (var index in options){
        switch (options[index].type){
            case "optimizer":
                this.setOptimizer(options[index].optimizer, options[index].value);
                break;
            case "loss":
                this.setLoss(options[index].value);
                break;
            case "metrics":
                this.setMetrics(options[index].value);
                break;
        }
    }
};

NeuralNetwork.prototype.prepareData = function(dataX, dataY){
    this.dim = dataX[0].length?dataX[0].length:0;
    if (this.dim == 0){
        dataX = Datasets.zip(dataX);
        this.dim = 1;
    }
    var classes = dataY;

    // check if y is a number (for classes) else convert to numbers
    if (typeof dataY[0] !='number'){
        var hist = Pmf.makeHistFromList(classes);
        var keys = Object.keys(hist.dictwrapper.dict);
        var key2num = {};
        for (var i in keys){
            key2num[keys[i]] = parseFloat(i);
        }
        var numClass = [];
        for (var i in classes) {
            numClass.push(key2num[classes[i]]);
        }
        dataY = numClass;
    } else {
        classes = [];
        dataY.forEach(function(e){
            classes.push(String(e));
        });
    }
    return [dataX,dataY,keys];
};

NeuralNetwork.prototype.toOneHot = function(labels,x){
    var oneHotVectors = x.map(function(item){
        var oneHot = Array(labels.length).fill(0);
        oneHot[item] = 1;
        return oneHot;
    });
    return oneHotVectors;
};

NeuralNetwork.prototype.train = function(x, y){
    var data = this.prepareData(x,y);
    x = data[0];
    y = this.toOneHot(data[2],data[1]);
    this.labels = data[2];
    var shapeX = [], shapeY = [];
    if (x[0].length!=undefined){
        shapeX.push(x.length, x[0].length);
    } else {
        shapeX.push(x.length, 1);
    }
    if (y[0].length!=undefined){
        shapeY.push(y.length, y[0].length);
    } else {
        shapeY.push(y.length, 1);
    }
    this.x = tf.tensor(x, shapeX);
    this.y = tf.tensor(y, shapeY);
    this.model.compile(this.options);
    this.model.fit(this.x, this.y ,{
        epochs: 40,
        //validationData: [xTest, yTest],
        callbacks: {
          onEpochEnd:(epoch, logs) => {
            this.lossValues.push(logs.loss);
            this.accuracyValues.push(logs.acc);
          },
        }
    });
    //console.log(this.lossValues, this.accuracyValues);
    return this.model;
};

NeuralNetwork.prototype.predict = function(test){
    var predict = this.model.predict(tf.tensor(test,[1,test.length]));
    var predict_array = Array.from(predict.dataSync());
    var indexOfMaxValue = predict_array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    var label = this.labels[indexOfMaxValue];
    return [label,predict_array];
};

module.exports = {
    NeuralNetwork,
};
