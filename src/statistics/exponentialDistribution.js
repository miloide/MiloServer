function ExponentialDistribution(lambda){
    if (lambda <= 0){
        throw "Invalid lambda:"+lambda;
    }
    this.lambda = lambda;
    this.calculateConstants();
};

ExponentialDistribution.prototype.fromData = function(data){
    data.forEach(element => {
        if (element < 0){
            throw "Sample contains negative values";
        }
    });
    var len = data.length;
    var mean = data.reduce(function(x,y){
        return (x+y)/len;
    });

    if (mean == 0){
        throw "Samples are all zeros";
    }
    this.lambda = 1/mean;
    this.calculateConstants();
};

ExponentialDistribution.prototype.calculateConstants = function(){
    var self = this;
    this.mean = 1/this.lambda;
    this.variance = 1/(Math.pow(self.lambda,2));
    this.sd = 1/this.lambda;
    this.entropy = 1 - Math.log(self.lambda);
};

ExponentialDistribution.prototype.getLambda = function(){
     return this.lambda;
};

ExponentialDistribution.prototype.getMean = function(){
    return this.mean;
};

ExponentialDistribution.prototype.getVariance = function(){
    return this.variance;
};

ExponentialDistribution.prototype.getEntropy = function(){
    return this.entropy;
};

ExponentialDistribution.prototype.p = function(x){
    var self = this;
    if (x instanceof Array){
        var probabilities = [];
        x.forEach(function(item){
            probabilities.push(value(item));
        });
        return probabilities;
    } else {
        return value(x);
    }
    function value(x){
        if (x < 0){
            return 0;
        } else {
            return self.lambda * Math.exp(-(self.lambda*x));
        }
    }
};

ExponentialDistribution.prototype.logp = function(x){
    var self = this;
    if (x instanceof Array){
        var logProbailities = [];
        x.forEach(function(item){
            logProbailities.push(value(item));
        });
        return logProbailities;
    } else {
        return value(x);
    }
    function value(x){
        if (x < 0){
            return 0;
        } else {
            return Math.log(self.lambda) - self.lambda*x;
        }
    }
};

ExponentialDistribution.prototype.cdf = function(x){
    var self = this;
    if (x instanceof Array){
        var cdfs = [];
        x.forEach(function(item){
            cdfs.push(value(item));
        });
        return cdfs;
    } else {
        return value(x);
    }
    function value(x){
        if (x < 0){
            return 0;
        } else {
            return (1 - Math.exp(-(self.lambda*x)));
        }
    }
};

ExponentialDistribution.prototype.render = function(label,color){
    var maxRange = this.mean + 5;
    var minRange = this.mean - 5;
    var x_ = [], y_ = [];
    for (var itr = minRange; itr < maxRange; itr +=0.1){
        x_.push(itr);
        y_.push(this.cdf(itr));
    }
    var plotOptions = {
      'type': 'scatter',
      'name': label,
      'x': x_,
      'y':y_,
      'marker':{'color':color}
    };
    return plotOptions;
};

ExponentialDistribution.prototype.quantile = function(p){
    if (p < 0 || p > 1){
        throw "Invalid probability";
    } else {
        return -Math.log(1-p)/this.lambda;
    }
};

module.exports = ExponentialDistribution;