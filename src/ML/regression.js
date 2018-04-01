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
    var plotPoints_x = [minPoint, maxPoint];
    return [data, plotPoints_x];
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
        var hist = Pmf.makeHistFromList(data.groupBy);
        var keys = hist.dictwrapper.values();
        var key2color = {}
        for (var i in keys) key2color[keys[i]] = i+1;
        var color = [];
        for (var i in data.groupBy) color.push(key2color[data.groupBy[i]]);
        originalData['marker'] = {'color':color};
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
        console.log("for",plotPointsX,"at",theta,"=",plotPointsY);
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
    if(!config.trace) {
        config.trace = false;
    }

    this.iterations = config.iterations;
    this.alpha = config.alpha;
    this.lambda = config.lambda;
    this.trace = config.trace;
    this.plotPoints = [];
    this.plotTheta = [];
};

LinearRegression.prototype.fit = function (data_x,data_y) {
    var data = Datasets.zip(data_x,data_y);
    var N = data.length, X = [], Y = [];
    var constructPlot = false;
    this.dim = data[0].length;
    if (data[0]!=undefined){
        if (data[0].length  == 2){
            constructPlot = true;
            plot = new Plot();
        }
    }
    for (var i=0; i < N; ++i) {
        var row = data[i];
        var x_i = [];
        var y_i = row[row.length-1];
        x_i.push(1.0);
        for(var j=0; j < row.length-1; ++j) {
            x_i.push(row[j]);
        }
        Y.push(y_i);
        X.push(x_i);
    }
    this.plotPoints = setPlotData({'x': X, 'y' : Y});
    this.theta = [];
    for (var d = 0; d < this.dim; ++d) {
        this.theta.push(0.0);
    }
    var subIterationLength = this.iterations/10==0?1:this.iterations/10;
    var subRangeEnd = subIterationLength;
    for (var k = 0; k <= this.iterations; ++k) {
        var Vx = this.grad(X, Y, this.theta);

        for(var d = 0; d < this.dim; ++d) {
            this.theta[d] = this.theta[d] - this.alpha * Vx[d];
        }
        if (constructPlot && k == subRangeEnd){
            this.plotTheta.push(JSON.parse(JSON.stringify(this.theta)));
            subRangeEnd += subIterationLength;
        }

    }
    //this.visualize();
    return this;
};

LinearRegression.prototype.visualize = function(){
    showRegressionPlot(this.plotPoints[1],this.plotPoints[0] , this.plotTheta, "Linear Regression");
};

LinearRegression.prototype.grad = function(X, Y, theta) {
    var N = X.length;

    var Vtheta = [];

    for(var d = 0; d < this.dim; ++d){
        var g = 0;
        for(var i = 0; i < N; ++i){
            var x_i = X[i];
            var y_i = Y[i];

            var predicted = this.h(x_i, theta);

            g += (predicted - y_i) * x_i[d];
        }

        g = (g + this.lambda * theta[d]) / N;

        Vtheta.push(g);
    }

    return Vtheta;
};

LinearRegression.prototype.h = function(x_i, theta) {
    var predicted = 0.0;
    for(var d = 0; d < this.dim; ++d) {
        predicted += x_i[d] * theta[d];
    }
    return predicted;
}

LinearRegression.prototype.cost = function(X, Y, theta) {

    var N = X.length;
    var cost = 0;
    for(var i = 0; i < N; ++i){
        var x_i = X[i];
        var predicted = this.h(x_i, theta);
        cost += (predicted - Y[i]) * (predicted - Y[i]);
    }

    for(var d = 0; d < this.dim; ++d) {
        cost += this.lambda * theta[d] * theta[d];
    }

    return cost / (2.0 * N);
};

LinearRegression.prototype.transform = function(x) {
    if(x[0].length){ // x is a matrix
        var predicted_array = [];
        for(var i=0; i < x.length; ++i){
            var predicted = this.transform(x[i]);
            predicted_array.push(predicted);
        }
        return predicted_array;
    }

    // x is a row vector
    var x_i = [];
    x_i.push(1.0);
    for(var j=0; j < x.length; ++j){
        x_i.push(x[j]);
    }
    return this.h(x_i, this.theta);
};


var LogisticRegression = function(config) {
    var config = config || {};
    if(!config.alpha){
        config.alpha = 0.001;
    }
    if(!config.iterations) {
        config.iterations = 100;
    }
    if(!config.lambda) {
        config.lambda = 0;
    }
    if(!config.threshold){
        config.threshold = 0;
    }
    this.alpha = config.alpha;
    this.lambda = config.lambda;
    this.iterations = config.iterations;
    this.plotTheta = [];
    this.plotPoints = [];
    this.threshold = config.threshold;
};

LogisticRegression.prototype.fit = function(data_x,data_y) {

    this.dim = data_x[0].length?data_x[0].length:0;
    if (this.dim == 0){
        data_x = Datasets.zip(data_x);
        this.dim = 1;
    }

    if (this.dim == 1){
        for (var index=0;index<data_x.length;index++){
            data_x[index].push(data_y[index]);
        }
    }
    var N = data_x.length;
    var constructPlot = false;
    var X = [];
    var Y = [];
    if (data_x[0]!=undefined){
        if (data_x[0].length  == 2){
            constructPlot = true;
        }
    }
    for(var i=0; i < N; ++i){
        var row = data_x[i];
        var row_y = data_y[i];
        var x_i = [];
        var y_i = row_y;
        x_i.push(1.0);
        for(var j=0; j < row.length; ++j){
            x_i.push(row[j]);
        }
        X.push(x_i);
        Y.push(y_i);
    }
    console.log("Coords",X,Y);
    var temp = {};
    temp.x = [];
    temp.y = [];
    X.forEach(function(e,i){
        temp.x.push(e[1]);
        temp.y.push(e[2]);
    });
    temp.groupBy = Y;

    this.plotPoints = [temp,[arrayMin(temp.x),arrayMax(temp.x)]];
    this.theta = [];
    for(var d = 0; d < this.dim; ++d){
        this.theta.push(0.0);
    }
    var subIterationLength = this.iterations/10==0?1:this.iterations/10;
    var subRangeEnd = subIterationLength;
    for(var iter = 0; iter < this.iterations; ++iter){
        var theta_delta = this.grad(X, Y, this.theta);
        for(var d = 0; d < this.dim; ++d){
            this.theta[d] = this.theta[d] - this.alpha * theta_delta[d];
        }

        if(constructPlot && iter == subRangeEnd){
            this.plotTheta.push(JSON.parse(JSON.stringify(this.theta)));
            subRangeEnd += subIterationLength;
        }

    }
    this.threshold = this.computeThreshold(X, Y);
    //his.visualize(this.plotPoints);

    return this;
};

LogisticRegression.prototype.visualize = function(){
    showRegressionPlot(this.plotPoints[1],this.plotPoints[0] , this.plotTheta, "Logistic Regression",this.threshold,true);
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
}

LogisticRegression.prototype.grad = function(X, Y, theta) {
    var N = X.length;
    var Vx = [];
    for(var d = 0; d < this.dim; ++d) {
        var sum = 0.0;
        for(var i = 0; i < N; ++i){
            var x_i = X[i];
            var predicted = this.h(x_i, theta);
            sum += ((predicted - Y[i]) * x_i[d] + this.lambda * theta[d]) / N;
        }
        Vx.push(sum);
    }

    return Vx;

}

LogisticRegression.prototype.h = function(x_i, theta) {
    var gx = 0.0;
    for(var d = 0; d < this.dim; ++d){
        gx += theta[d] * x_i[d];
    }
    return 1.0 / (1.0 + Math.exp(-gx));
}

LogisticRegression.prototype.transform = function(x) {
    if(x[0].length){ // x is a matrix
        var predicted_array = [];
        for(var i=0; i < x.length; ++i){
            var predicted = this.transform(x[i]);
            predicted_array.push(predicted);
        }
        return predicted_array;
    }

    var x_i = [];
    x_i.push(1.0);
    for(var j=0; j < x.length; ++j){
        x_i.push(x[j]);
    }
    return this.h(x_i, this.theta);
}

LogisticRegression.prototype.cost = function(X, Y, theta) {
    var N = X.length;
    var sum = 0;
    for(var i = 0; i < N; ++i){
        var y_i = Y[i];
        var x_i = X[i];
        sum += -(y_i * Math.log(this.h(x_i, theta)) + (1-y_i) * Math.log(1 - this.h(x_i, theta))) / N;
    }

    for(var d = 0; d < this.dim; ++d) {
        sum += (this.lambda * theta[d] * theta[d]) / (2.0 * N);
    }
    return sum;
};

var MultiClassLogistic = function(config){
    var config = config || {};
    if(!config.alpha){
        config.alpha = 0.001;
    }
    if(!config.iterations) {
        config.iterations = 100;
    }
    if(!config.lambda) {
        config.lambda = 0;
    }
    this.alpha = config.alpha;
    this.lambda = config.lambda;
    this.iterations = config.iterations;
};

MultiClassLogistic.prototype.fit = function(data, classes) {
    this.dim = data[0].length;
    for(var i = 0;i < data.length;i++){
        data[i].push(classes[i]);
    }
    var N = data.length;
    var unique = classes.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    this.classes = unique;
    this.logistics = {};
    var result = {};
    
    for(var k = 0; k < this.classes.length; ++k){
        var c = this.classes[k];
        this.logistics[c] = new LogisticRegression({
            alpha: this.alpha,
            lambda: this.lambda,
            iterations: this.iterations
        });
        var data_c = [];
        for(var i=0; i < N; ++i){
            var row = [];
            for(var j=0; j < this.dim-1; ++j){
                row.push(data[i][j]);
            }
            row.push(data[i][this.dim-1] == c ? 1 : 0);
            data_c.push(row);
        }
        result[c] = this.logistics[c].fit(data_c);
    }
    return result;
};

MultiClassLogistic.prototype.transform = function(x) {
    if(x[0].length){ // x is a matrix
        var predicted_array = [];
        for(var i=0; i < x.length; ++i){
            var predicted = this.transform(x[i]);
            predicted_array.push(predicted);
        }
        return predicted_array;
    }
    var max_prob = 0.0;
    var best_c = '';
    for(var k = 0; k < this.classes.length; ++k) {
        var c = this.classes[k];
        var prob_c = this.logistics[c].transform(x);
        if(max_prob < prob_c){
            max_prob = prob_c;
            best_c = c;
        }
    }
    return best_c;
}

module.exports = {
    LinearRegression,
    LogisticRegression,
    MultiClassLogistic
};