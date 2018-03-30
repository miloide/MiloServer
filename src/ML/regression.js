var Plot = require('../plot');
var jsregression = jsregression || {};
var Datasets = require('../datasets');

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
    var length = data['x'].length;
    data['x'] = data['x'].map(function(item){
        return parseFloat(item[1]);
    });
    data['y'] = data['y'].map(function(item){
        return parseFloat(item);
    });
    var minPoint = arrayMin(data['x']);
    var maxPoint = arrayMax(data.x);
    var plotPoints_x = [minPoint, maxPoint];
    var plotPoints_y = [];
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
function showPlot(plot, plotPoints_x, data, theta, label){

    var plotPoints_y = []
    for(var i = 0;i < plotPoints_x.length; i++){
        var y = plotPoints_x[i] * theta[1] + theta[0];
        plotPoints_y.push(y);
    }
    var plotOptions = [
    {
      'type': 'scatter',
      'name': label,
      'x': data['x'],
      'y': data['y'],
      'marker':{'color':'#ffffff'},
      'isLine': false
    },
    {
      'type': 'scatter',
      'name': label,
      'x': plotPoints_x,
      'y':plotPoints_y,
      'marker':{'color':'#ffffff'},
      'isLine': true
    },
    ];
    plot.setData(plotOptions);
    plot.react();
}

function showLogisticPlot(plot, data, theta, label, groupBy){
    var plotPoints_x = [0,10];
    var plotPoints_y = [];
    for(var i = 0;i < plotPoints_x.length; i++){
        var y = plotPoints_x[i] * theta[1] + theta[0];
        plotPoints_y.push(y);
    }
    var plotOptions = [
    {
      'type': 'scatter',
      'name': label,
      'x': data['x'],
      'y': data['y'],
      'group' : Datasets.imported["iris"]["Class"],
      'marker':{'color':'#ffffff'},
      'isLine': false
    },
    {
      'type': 'scatter',
      'name': label,
      'x': plotPoints_x,
      'y':plotPoints_y,
      'marker':{'color':'#ffffff'},
      'isLine': true
    },
    ];
    plot.setData(plotOptions);
    plot.react();
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
        this.plotTheta = [];
    };

    LinearRegression.prototype.fit = function (data) {
        var N = data.length, X = [], Y = [];
        var constructPlot = false;
        var plot;
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
        var plotPoints = setPlotData({'x': X, 'y' : Y});
        this.theta = [];
        for (var d = 0; d < this.dim; ++d) {
            this.theta.push(0.0);
        }

        for (var k = 0; k < this.iterations; ++k) {
            var Vx = this.grad(X, Y, this.theta);

            for(var d = 0; d < this.dim; ++d) {
                this.theta[d] = this.theta[d] - this.alpha * Vx[d];
            }
            var iters = this.iterations % 10;
            if(constructPlot && k % iters == 0){
                this.plotTheta.push(JSON.parse(JSON.stringify(this.theta)));
            }
        }
        console.log(this.plotTheta);
        this.visualize(plot, plotPoints);
        return {
            theta: this.theta,
            dim: this.dim,
            weights: this.plotTheta,
            cost: this.cost(X, Y, this.theta),
            config: {
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations
            }
        };
    };

    LinearRegression.prototype.visualize = function(plot,plotPoints){
        var j = 0;
        var self = this;
        (function rePlot (i) {
            setTimeout(function () {
                showPlot(plot, plotPoints[1],plotPoints[0] , self.plotTheta[j++], "Linear Regression");
                if (--i) {
                    rePlot(i);
                }
            }, 1000);
        })(this.plotTheta.length);
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
        this.alpha = config.alpha;
        this.lambda = config.lambda;
        this.iterations = config.iterations;
    }

    LogisticRegression.prototype.fit = function(data) {
        this.dim = data[0].length;
        var N = data.length;

        var X = [];
        var Y = [];
        if (data[0]!=undefined){
            if (data[0].length  == 2){
                constructPlot = true;
                plot = new Plot();
            }
        }
        for(var i=0; i < N; ++i){
            var row = data[i];
            var x_i = [];
            var y_i = row[row.length-1];
            x_i.push(1.0);
            for(var j=0; j < row.length-1; ++j){
                x_i.push(row[j]);
            }
            X.push(x_i);
            Y.push(y_i);
        }
        var plotPoints = setPlotData({'x': X, 'y' : Y});
        this.theta = [];
        this.plotTheta = [];
        for(var d = 0; d < this.dim; ++d){
            this.theta.push(0.0);
        }

        for(var iter = 0; iter < this.iterations; ++iter){
            var theta_delta = this.grad(X, Y, this.theta);
            for(var d = 0; d < this.dim; ++d){
                this.theta[d] = this.theta[d] - this.alpha * theta_delta[d];
            }
        }
        var iters = this.iterations % 10;
        if(constructPlot && iter % iters == 0){
            this.plotTheta.push(JSON.parse(JSON.stringify(this.theta)));
        }
        this.threshold = this.computeThreshold(X, Y);
        this.visualize(plot, plotPoints);

        return {
            theta: this.theta,
            threshold: this.threshold,
            weights : this.plotTheta,
            cost: this.cost(X, Y, this.theta),
            config: {
                alpha: this.alpha,
                lambda: this.lambda,
                iterations: this.iterations
            }
        }
    };

    LogisticRegression.prototype.visualize = function(plot,plotPoints){
        var j = 0;
        var self = this;
        (function rePlot (i) {
            setTimeout(function () {
                showPlot(plot, plotPoints[1],plotPoints[0] , self.plotTheta[j++], "Logistic Regression");
                if (--i) {
                    rePlot(i);
                }
            }, 1000);
        })(this.plotTheta.length);
    };

    LogisticRegression.prototype.computeThreshold = function(X, Y){
        var threshold=1.0, N = X.length;

        for (var i = 0; i < N; ++i) {
            var prob = this.transform(X[i]);
            if(Y[i] == 1 && threshold > prob){
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
            sum += - (y_i * Math.log(this.h(x_i, theta)) + (1-y_i) * Math.log(1 - this.h(x_i, theta))) / N;
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
        var N = data.length;

        if(!classes){
            classes = [];
            for(var i=0; i < N; ++i){
                var found = false;
                var label = data[i][this.dim-1];
                for(var j=0; j < classes.length; ++j){
                    if(label == classes[j]){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    classes.push(label);
                }
            }
        }

        this.classes = classes;

        this.logistics = {};
        var result = {};
        for(var k = 0; k < this.classes.length; ++k){
            var c = this.classes[k];
            this.logistics[c] = new jsr.LogisticRegression({
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