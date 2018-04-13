
var kmeans = require('./clusters');

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

function Kmeans(k, iters, data, distance){
    this.k = k || config.k;
    this.iters = iters || config.maxIters;
    this.data = data|| config.data;
    this.clusters;
    this.centroidMap = {};
    this.train();
    this.mapper();
}

Kmeans.prototype.initialCentroids = function(){
    var initialCentroids = [];
    var length = this.data.length;
    for(var i = 0;i < this.k; i++){
        initialCentroids.push(this.data[Math.floor(Math.random()*length)]);
    }
    return initialCentroids;
}

Kmeans.prototype.train = function(){
    kmeans.k(this.k);
    kmeans.iterations(this.iters);
    kmeans.data(this.data);
    this.clusters = kmeans.clusters();
    return this;
}

Kmeans.prototype.mapper = function(){
    for(var cluster in this.clusters){
        var centroid = this.clusters[cluster].centroid;
        this.centroidMap[cluster] = centroid;
    }
}

Kmeans.prototype.predict = function(test){
    var distanceFromCentroid = [];
    for(var cluster in this.clusters){
        var centroid = this.clusters[cluster].centroid;
        distanceFromCentroid.push(distances["euclidean"](centroid,test));
    }
    var min = distancesFromCentroid.reduce(function(a, b) {
        return Math.min(a, b);
    });
    return distancesFromCentroid.indexOf(min)+1;
}

Kmeans.prototype.printCluster = function(){
    return this.cluster;
}

module.exports = Kmeans;
