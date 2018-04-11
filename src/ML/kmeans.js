var config = {
    k : 3,
    maxIters : 100,
    distance : "euclidean"
};

var distances = {
    euclidean: function(v1, v2) {
        var total = 0;
        for (var i = 0; i < v1.length; i++) {
           total += Math.pow(v2[i] - v1[i], 2);      
        }
        return Math.sqrt(total);
     },
     manhattan: function(v1, v2) {
       var total = 0;
       for (var i = 0; i < v1.length ; i++) {
          total += Math.abs(v2[i] - v1[i]);      
       }
       return total;
     },
     max: function(v1, v2) {
       var max = 0;
       for (var i = 0; i < v1.length; i++) {
          max = Math.max(max , Math.abs(v2[i] - v1[i]));      
       }
       return max;
     },
     min:function(v1, v2){
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
    this.distance = distance || config.distance;
    this.data = [];
    this.centroids = [];
    this.initCentroids();
}

Kmeans.prototype.initCentroids = function(){
    this.dataLength = this.data.length;
    for(var i = 0;i < this.k; i++){
        this.centroids.push(this.data[Math.floor(Math.random()*this.dataLength)]);
    }
}

Kmeans.prototype.findDistanceFromAllCentroid(test){
    var distances = [];

}

