var visual = require('./visualizeKnn');

function Knn(k, x, y, distance){
    this.distanceFunction = distance;
    this.k = (k == undefined)? 1 : k;
    this.x = (x == undefined)? []: x;
    this.y = (y == undefined)? []: y;
}

Knn.prototype.getX = function(){
    return this.x;
}

Knn.prototype.getY = function(){
    return this.y;
}

Knn.prototype.getk = function(){
    return this.k;
}
Knn.prototype.add = function(x, y){
    if(x != undefined && y !=undefined ){
        this.x.append(x);
        this.y.append(y);
    }
}

Knn.prototype.euclideanDistance = function(point1, point2){
    
    var lengthPoint1 = point1.length;
    var lengthPoint2 = point2.length;
    if(lengthPoint1!=lengthPoint2){
        if(lengthPoint1>lengthPoint2){
            for(var i = 0;i < lengthPoint1 - lengthPoint2;i++)
                point2.push(0);
        }
        if(lengthPoint2>lengthPoint1){
            for(var i = 0;i < lengthPoint2 - lengthPoint2;i++)
                point1.push(0);
        }
    }
    var distance = 0;
    for(var i = 0;i < point1.length; i++){
        distance += Math.pow(point1[i] - point2[i],2);
    }
    return Math.sqrt(distance);
};

Knn.prototype.manhattanDistance = function(point1, point2){
    
    var lengthPoint1 = point1.length;
    var lengthPoint2 = point2.length;
    if(lengthPoint1!=lengthPoint2){
        if(lengthPoint1>lengthPoint2){
            for(var i = 0;i < lengthPoint1 - lengthPoint2;i++)
                point2.push(0);
        }
        if(lengthPoint2>lengthPoint1){
            for(var i = 0;i < lengthPoint2 - lengthPoint2;i++)
                point1.push(0);
        }
    }
    var distance = 0;
    for(var i = 0;i < point1.length; i++){
        distance += Math.abs(point1[i] - point2[i]);
    }
    return distance;
};

Knn.prototype.getNeighbors = function(test){
    var distances = [];
    var self = this;
    this.x.forEach(function(item, index){
        if(this.distance == "euclideanDistance")
            var distance = self.euclideanDistance((item instanceof Array)? item:[item], (test instanceof Array)? test:[test]);
        else
            var distance = self.manhattanDistance((item instanceof Array)? item:[item], (test instanceof Array)? test:[test]);
        var node = {};
       node.item = [self.y[index], distance];
       distances.push(node);
    });
    distances.sort(function(a, b){
       return (a.item[1] - b.item[1]); 
    });
    return distances.slice(0, this.k);
};

Knn.prototype.getPrediction = function(test){
    var distances = this.getNeighbors(test);
    var nearest = {};
    for(var i = 0; i < this.k; i++){
        var neighbor = distances[i];
        var label = neighbor.item[0];
        if(!(nearest.hasOwnProperty(label))){
            nearest[label] = 1;
        }
        else{
            nearest[label] += 1;
        }
    }
    console.log(nearest);
    var predictedVal = Object.keys(nearest).reduce(function(a, b){ return nearest[a] > nearest[b] ? a : b });
    return predictedVal;
};

Knn.prototype.visualize = function(){
    
}

module.exports = Knn;