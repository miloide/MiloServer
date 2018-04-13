
var kmeansHelper = require('clusters');
var kmeansVizualise = require('./visualizeKmeans');
var zip = require('../datasets').zip;
var config = {
    k : 3,
    maxIters : 100,
    data :[]
};

var distances = {
    "euclidean": function(v1, v2) {
        var total = 0;
        for (var i = 0; i < v1.length; i++) {
           total += Math.pow(v2[i] - v1[i], 2);
        }
        return Math.sqrt(total);
     },
     "manhattan": function(v1, v2) {
       var total = 0;
       for (var i = 0; i < v1.length ; i++) {
          total += Math.abs(v2[i] - v1[i]);
       }
       return total;
     },
     "max": function(v1, v2) {
       var max = 0;
       for (var i = 0; i < v1.length; i++) {
          max = Math.max(max , Math.abs(v2[i] - v1[i]));
       }
       return max;
     },
     "min":function(v1, v2){
         var min = 0;
         for (var i = 0; i < v1.length; i++) {
            min = Math.min(min , Math.abs(v2[i] - v1[i]));
         }
         return min;
     }
  }

function Kmeans(k, iters, data){
    this.k = k || config.k;
    this.iters = iters || config.maxIters;
    this.data = data|| config.data;
    this.clusters;
    this.centroidMap = {};
    this.mapper();
    this.train();
}

Kmeans.prototype.initialCentroids = function(){
    var initialCentroids = [];
    var length = this.data.length;
    for (var i = 0;i < this.k; i++){
        initialCentroids.push(this.data[Math.floor(Math.random()*length)]);
    }
    return initialCentroids;
};

Kmeans.prototype.train = function(){
    kmeansHelper.k(this.k);
    kmeansHelper.iterations(this.iters);
    kmeansHelper.data(this.data);
    this.clusters = kmeansHelper.clusters();
};

Kmeans.prototype.mapper = function(){
    for (var cluster in this.clusters){
        var centroid = this.clusters[cluster].centroid;
        this.centroidMap[cluster] = centroid;
    }
};

Kmeans.prototype.normalizeData = function(){
    var data = this.data;
    var centroids = this.initialCentroids();
    if (data[0].length >= 2){
        var x = data.map(function(item){
            return item[0];
        });

        var y = data.map(function(item){
            return item[1];
        });

        var xCentroids = centroids.map(function(item){
            return item[0];
        });

        var yCentroids = centroids.map(function(item){
            return item[1];
        });
    }
    x = this.scaleBetween(x, 0,500);
    y = this.scaleBetween(y, 0,500);
    xCentroids = this.scaleBetween(xCentroids, 0, 500);
    yCentroids = this.scaleBetween(yCentroids, 0, 500);
    return [zip(x,y),zip(xCentroids,yCentroids)];
};

Kmeans.prototype.scaleBetween = function(arr, scaledMin, scaledMax){
    var max = Math.max.apply(Math, arr);
    var min = Math.min.apply(Math, arr);
    return arr.map(num => (scaledMax-scaledMin)*(num-min)/(max-min)+scaledMin);
};

Kmeans.prototype.predict = function(test){
    var distanceFromCentroid = [];
    for (var cluster in this.clusters){
        var centroid = this.clusters[cluster].centroid;
        distanceFromCentroid.push(distances["euclidean"](centroid,test));
    }
    var min = distanceFromCentroid.reduce(function(a, b) {
        return Math.min(a, b);
    });
    return "Cluster " + distanceFromCentroid.indexOf(min)+1;
};

Kmeans.prototype.printCluster = function(){
    return [this.centroidMap,this.clusters];
};

Kmeans.prototype.visualize = function(){
    kmeansVizualise(700,700,0,0,0,this);
    return this;
};
module.exports = Kmeans;
