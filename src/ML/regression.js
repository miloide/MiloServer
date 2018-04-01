var Plot = require('../plot');
var Datasets = require('../datasets');
var Pmf = require('../statistics/pmf');

function arrayMax(array) {
  return array.reduce(function(a, b) {
    return Math.max(a, b);
  });
}

function arrayMin(array) {
  return array.reduce(function(a, b) {
    return Math.min(a, b);
  });
}
function setPlotData(data){
    data.x = data.x.map(function(item){
        return parseFloat(item[1]);
    });
    data.y = data.y.map(function(item){
        return parseFloat(item);
    });
    var minPoint = arrayMin(data.x);
    var maxPoint = arrayMax(data.x);
    var plotPointsX = [minPoint, maxPoint];
    return [data, plotPointsX];
}

/**
 * This function generates two random points
 * based on theta and plots a straight line.
 * It plots two scatter plot into one.
 * @param {*} plot - Plot class
 * @param {*} type  - type of plot to show
 * @param {*} data  - data to plot
 * @param {*} theta  - coeffeceints
 */
function showRegressionPlot(plotPointsX, data, plotTheta, label,threshold=0,logistic=false){
    var WAIT = 500;
    var UPDATE_LEN = plotTheta.length;
    var count = 0;
    var plot = new Plot();
    var gd = plot.reactive();
    var originalData = {
        // Trace for original data
        'type': 'scatter',
        'name': "Input Data",
        'x': data['x'],
        'y': data['y'],
        'mode': 'markers',
    };
    if (data.groupBy){
        originalData['marker'] = {'color':data.colors};
        originalData['text'] = data.groupBy;
    }
    Plotly.plot(gd, [
        originalData,
        {
            // Trace for line of regression
            'type': 'scatter',
            name: label + " #" + count,
            x: makeData(count)[0],
            y: makeData(count)[1],
            'mode': 'markers+lines',
        }],{
        // Layout Options
        legend: {
            traceorder: 'reversed'
        }
    }).then(function() {
        update(count);
    });

    function update(index) {
        if (index === UPDATE_LEN) {
            return;
        }

        setTimeout(function() {
          var updateObj = {
            name: [label + " #" + index],
            x: [makeData(index)[0]],
            y: [makeData(index)[1]],
          };
          Plotly.restyle(gd, updateObj, [1])
            .then(function() {
                update(++index);
            });
        }, WAIT);
      }

    function makeData(offset) {
        var theta = plotTheta[offset];
        var plotPointsY = [];
        for (var i = 0; i < plotPointsX.length; i++){
            var y = plotPointsX[i] * theta[1] + theta[0];
            if (logistic){
                y = plotPointsX[i] *(-theta[0]/theta[1]) + (-threshold/theta[1]);
            }
            plotPointsY.push(y);
        }
        return [plotPointsX,plotPointsY];
    }
}

var LinearRegression = function(config) {

    config = config || {};

    if (!config.iterations) {
        config.iterations = 1000;
    }
    if (!config.alpha) {
        config.alpha = 0.001;
    }
    if (!config.lambda) {
        config.lambda = 0.0;
    }
    if (!config.trace) {
        config.trace = false;
    }

    this.iterations = config.iterations;
    this.alpha = config.alpha;
    this.lambda = config.lambda;
    this.trace = config.trace;
    this.plotPoints = [];
    this.plotTheta = [];
};

LinearRegression.prototype.fit = function (dataX,dataY) {
    var data = Datasets.zip(dataX,dataY);
    var N = data.length, X = [], Y = [];
    var constructPlot = false;
    this.dim = data[0].length;
    if (data[0]!=undefined){
        if (data[0].length  == 2){
            constructPlot = true;
        }
    }
    for (var i=0; i < N; ++i) {
        var row = data[i];
        var xI = [];
        var yI = row[row.length-1];
        xI.push(1.0);
        for (var j=0; j < row.length-1; ++j) {
            xI.push(row[j]);
        }
        Y.push(yI);
        X.push(xI);
    }
    this.plotPoints = setPlotData({'x': X, 'y' : Y});
    this.theta = [];
    for (var count = 0; count < this.dim; ++count) {
        this.theta.push(0.0);
    }

    var subIterationLength = this.iterations/10==0?1:this.iterations/10;
    var subRangeEnd = subIterationLength;
    for (var k = 0; k <= this.iterations; ++k) {
        var Vx = this.grad(X, Y, this.theta);

        for (var d = 0; d < this.dim; ++d) {
            this.theta[d] = this.theta[d] - this.alpha * Vx[d];
        }
        if (constructPlot && k == subRangeEnd){
            this.plotTheta.push(JSON.parse(JSON.stringify(this.theta)));
            subRangeEnd += subIterationLength;
        }
    }
    return this;
};

LinearRegression.prototype.visualize = function(){
    showRegressionPlot(this.plotPoints[1],this.plotPoints[0] , this.plotTheta, "Linear Regression");
    return this;
};

LinearRegression.prototype.grad = function(X, Y, theta) {
    var N = X.length;

    var Vtheta = [];

    for (var d = 0; d < this.dim; ++d){
        var g = 0;
        for (var i = 0; i < N; ++i){
            var xI = X[i];
            var yI = Y[i];

            var predicted = this.h(xI, theta);

            g += (predicted - yI) * xI[d];
        }

        g = (g + this.lambda * theta[d]) / N;

        Vtheta.push(g);
    }

    return Vtheta;
};

LinearRegression.prototype.h = function(xI, theta) {
    var predicted = 0.0;
    for (var d = 0; d < this.dim; ++d) {
        predicted += xI[d] * theta[d];
    }
    return predicted;
};

LinearRegression.prototype.cost = function(X, Y, theta) {

    var N = X.length;
    var cost = 0;
    for (var i = 0; i < N; ++i){
        var xI = X[i];
        var predicted = this.h(xI, theta);
        cost += (predicted - Y[i]) * (predicted - Y[i]);
    }

    for (var d = 0; d < this.dim; ++d) {
        cost += this.lambda * theta[d] * theta[d];
    }

    return cost / (2.0 * N);
};

LinearRegression.prototype.transform = function(x) {
    if (x[0].length){ // x is a matrix
        var predictedArray = [];
        for (var i=0; i < x.length; ++i){
            var predicted = this.transform(x[i]);
            predictedArray.push(predicted);
        }
        return predictedArray;
    }

    // x is a row vector
    var xI = [];
    xI.push(1.0);
    for (var j=0; j < x.length; ++j){
        xI.push(x[j]);
    }
    return this.h(xI, this.theta);
};


var LogisticRegression = function(config) {
    var config = config || {};
    if (!config.alpha){
        config.alpha = 0.001;
    }
    if (!config.iterations) {
        config.iterations = 100;
    }
    if (!config.lambda) {
        config.lambda = 0;
    }
    if (!config.threshold){
        config.threshold = 0;
    }
    this.alpha = config.alpha;
    this.lambda = config.lambda;
    this.iterations = config.iterations;
    this.plotTheta = [];
    this.plotPoints = [];
    this.threshold = config.threshold;
};

LogisticRegression.prototype.fit = function(dataX,dataY,rawClasses=null) {

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
    if (this.dim == 1){
        for (var index=0;index<dataX.length;index++){
            dataX[index].push(dataY[index]);
        }
    }
    var N = dataX.length;
    var constructPlot = false;
    var X = [];
    var Y = dataY;
    if (dataX[0]!=undefined){
        if (dataX[0].length  == 2){
            constructPlot = true;
        }
    }
    for (var i=0; i < N; ++i){
        var row = dataX[i];
        var xI = [];
        xI.push(1.0);
        for (var j=0; j < row.length; ++j){
            xI.push(row[j]);
        }
        X.push(xI);
    }

    var temp = {};
    temp.x = [];
    temp.y = [];
    X.forEach(function(e){
        temp.x.push(e[1]);
        temp.y.push(e[2]);
    });
    temp.groupBy = classes;
    if (rawClasses){
        temp.groupBy = rawClasses;
    }
    temp.colors = dataY;

    this.plotPoints = [temp,[arrayMin(temp.x),arrayMax(temp.x)]];
    this.theta = [];
    for (var d = 0; d < this.dim; ++d){
        this.theta.push(0.0);
    }
    var subIterationLength = this.iterations/10==0?1:this.iterations/10;
    var subRangeEnd = subIterationLength;
    for (var iter = 0; iter < this.iterations; ++iter){
        var thetaDelta = this.grad(X, Y, this.theta);
        for (var d = 0; d < this.dim; ++d){
            this.theta[d] = this.theta[d] - this.alpha * thetaDelta[d];
        }

        if (constructPlot && iter == subRangeEnd){
            this.plotTheta.push(JSON.parse(JSON.stringify(this.theta)));
            subRangeEnd += subIterationLength;
        }

    }
    this.threshold = this.computeThreshold(X, Y);
    return this;
};

LogisticRegression.prototype.visualize = function(){
    showRegressionPlot(
        this.plotPoints[1],
        this.plotPoints[0],
        this.plotTheta,
        "Logistic Regression",
        this.threshold,
        true
    );
    return this;
};

LogisticRegression.prototype.computeThreshold = function(X, Y){
    var threshold=1.0, N = X.length;

    for (var i = 0; i < N; ++i) {
        var prob = this.transform(X[i]);
        if (Y[i] == 1 && threshold > prob){
            threshold = prob;
        }
    }
    return threshold;
};

LogisticRegression.prototype.grad = function(X, Y, theta) {
    var N = X.length;
    var Vx = [];
    for (var d = 0; d < this.dim; ++d) {
        var sum = 0.0;
        for (var i = 0; i < N; ++i){
            var xI = X[i];
            var predicted = this.h(xI, theta);
            sum += ((predicted - Y[i]) * xI[d] + this.lambda * theta[d]) / N;
        }
        Vx.push(sum);
    }

    return Vx;

};

LogisticRegression.prototype.h = function(xI, theta) {
    var gx = 0.0;
    for (var d = 0; d < this.dim; ++d){
        gx += theta[d] * xI[d];
    }
    return 1.0 / (1.0 + Math.exp(-gx));
};

LogisticRegression.prototype.transform = function(x) {
    if (x[0].length){ // x is a matrix
        var predictedArray = [];
        for (var i=0; i < x.length; ++i){
            var predicted = this.transform(x[i]);
            predictedArray.push(predicted);
        }
        return predictedArray;
    }

    var xI = [];
    xI.push(1.0);
    for (var j=0; j < x.length; ++j){
        xI.push(x[j]);
    }
    return this.h(xI, this.theta);
};

LogisticRegression.prototype.cost = function(X, Y, theta) {
    var N = X.length;
    var sum = 0;
    for (var i = 0; i < N; ++i){
        var yI = Y[i];
        var xI = X[i];
        sum += -(yI * Math.log(this.h(xI, theta)) + (1-yI) * Math.log(1 - this.h(xI, theta))) / N;
    }

    for (var d = 0; d < this.dim; ++d) {
        sum += (this.lambda * theta[d] * theta[d]) / (2.0 * N);
    }
    return sum;
};

var MultiClassLogistic = function(config){
    var config = config || {};
    if (!config.alpha){
        config.alpha = 0.001;
    }
    if (!config.iterations) {
        config.iterations = 100;
    }
    if (!config.lambda) {
        config.lambda = 0;
    }
    this.alpha = config.alpha;
    this.lambda = config.lambda;
    this.iterations = config.iterations;
};

MultiClassLogistic.prototype.fit = function(dataX,dataY) {

    var hist = Pmf.makeHistFromList(dataY);
    var unique = Object.keys(hist.dictwrapper.dict);
    var N = dataX.length;
    this.classes = unique;
    this.logistics = {};
    this.result = [];
    this.stringLables = dataY;
    if (typeof dataY[0] == 'number'){
        var stringLables = [];
        dataY.forEach(function(e){
            stringLables.push(String(e));
        });
        this.stringLables = stringLables;
    }
    for (var k = 0; k < this.classes.length; ++k){
        var c = this.classes[k];
        this.logistics[c] = new LogisticRegression({
            alpha: this.alpha,
            lambda: this.lambda,
            iterations: this.iterations
        });
        var classLabels = [];
        for (var i=0 ; i<N ; i++){
            classLabels.push( dataY[i] == c? 1 : 0);
        }
        this.result.push(this.logistics[c].fit(dataX,classLabels,this.stringLables));
    }
    return this;
};

MultiClassLogistic.prototype.visualize = function(){
    this.result.forEach(function(e){
        e.visualize();
    });
    return this;
};

MultiClassLogistic.prototype.transform = function(x) {
    if (x[0].length){ // x is a matrix
        var predictedArray = [];
        for (var i=0; i < x.length; ++i){
            var predicted = this.transform(x[i]);
            predictedArray.push(predicted);
        }
        return predictedArray;
    }
    var maxProb = 0.0;
    var bestClass = '';
    for (var k = 0; k < this.classes.length; ++k) {
        var c = this.classes[k];
        var classProbability = this.logistics[c].transform(x);
        if (maxProb < classProbability){
            maxProb = classProbability;
            bestClass = c;
        }
    }
    return bestClass;
};

module.exports = {
    LinearRegression,
    LogisticRegression,
    MultiClassLogistic
};
