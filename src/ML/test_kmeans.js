var config = {
    k : 3,
    maxIters : 100,
    distance : "euclidean"
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
    this.distanceFunction = distance || config.distance;
    this.data = data|| [];
    this.centroids = [];
    this.clusterToDataset = [];
    this.clusters = {};
    this.initCentroids();
    this.findCentroids();
}

Kmeans.prototype.initCentroids = function(){
    this.dataLength = this.data.length;
    for(var i = 0;i < this.k; i++){
        this.centroids.push(this.data[Math.floor(Math.random()*this.dataLength)]);
    }
}

Kmeans.prototype.findDistanceFromAllCentroid = function(test){
    var distancesFromCentroid = [];
    var distanceFunction = this.distanceFunction;
    for(var i = 0; i < this.k;i++){
        var distance = distances[distanceFunction](test, this.centroids[i]);
        distancesFromCentroid.push(distance);
    }
    return distancesFromCentroid;
}

Kmeans.prototype.findCluster = function(distancesFromCentroid){
    var min = distancesFromCentroid.reduce(function(a, b) {
        return Math.min(a, b);
    });
    return distancesFromCentroid.indexOf(min);
}

Kmeans.prototype.recomputeCentroid = function(clusters){
    for(var key in clusters){
        var cluster = clusters[key];
        var index = key;
        var newCentroid = [];
        cluster.forEach(function(c,i){
            if(c instanceof Array){
                c.map(function(item, index){
                    newCentroid[index] += item/cluster.length; 
                });
            }else{
                newCentroid[i]+=c/cluster.length;
            }
        });
        this.centroids[index] = newCentroid;
    }
}

Kmeans.prototype.findCentroids = function(){
    console.log(this.data);
    for(var i = 0;i < this.iters; i++){
        this.clusters = {};
        for(var j = 0;j < this.k; j++){
            this.clusters[j] = [];
        }
        console.log(this.clusters);
        var self = this;
        this.data.forEach(function(data){
            console.log(data);
            var distancesFromCentroid = self.findDistanceFromAllCentroid(data);
            var cluster = self.findCluster(distancesFromCentroid);
            var temp = self.clusters[cluster];
            temp.push(data);
            self.clusters[cluster] = temp;
        });
        this.recomputeCentroid(self.clusters);
        this.clusterToDataset = self.clusters;
    }
}

Kmeans.prototype.printCluster = function(){
    return this.clusterToDataset;
}

module.exports = Kmeans;