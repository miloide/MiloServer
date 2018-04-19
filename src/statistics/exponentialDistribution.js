function ExponentialDistribution(lambda){
    if (lambda <= 0){
        throw "Invalid lambda:"+lambda;
    }
    this.lambda = lambda;
    this.calculateConstants;
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
    if (x < 0){
        return 0;
    } else {
        return this.lambda * Math.exp(-this.lambda*x);
    }
};

ExponentialDistribution.prototype.logp = function(x){
    if (x < 0){
        return 0;
    } else {
        return Math.log(this.lambda) - this.lambda*x;
    }
};

ExponentialDistribution.prototype.cdf = function(x){
    if (x < 0){
        return 0;
    } else {
        return 1 - Math.exp(-this.lambda*x);
    }
};

ExponentialDistribution.prototype.quantile = function(p){
    if (p < 0 || p > 1){
        throw "Invalid probability";
    } else {
        return -Math.log(1-p)/this.lambda;
    }
};




