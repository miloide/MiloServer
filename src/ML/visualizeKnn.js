function Visualize(knn){
    if (knn != undefined){
      console.log(knn);
      this.knn = knn;
      this.x = knn.getX();
      this.y_ = knn.getY();
      console.log(this.x, this.y_);
      this.size = this.x.length;
      this.normalizeData();
     } else {  //The size of the canvas

      this.size = 20;  //The number of data points
      this.category = 2; //How many labels of the data set
      this.k = 3; // K in KNN
    }
    this.range = 600;
    this.d3 = Plotly.d3;
    this.colors = this.d3.scale.category20c();
  }

  Visualize.prototype.normalizeData = function(){
    this.labels = this.y_.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    console.log(this.labels);
    this.labelMap={};
    for (var i = 0;i< this.labels.length;i++){
        this.labelMap[this.labels[i]] = i;
    }
    console.log(this.labelMap);
    var self = this;
    this.y = this.y_.map(function(item,index){
      return self.labelMap[item]
    });
    this.category = this.labels.length;
    this.k = this.knn.getk();
  };

  Visualize.prototype.scaleBetween = function(arr,scaledMin, scaledMax) {
    var max = Math.max.apply(Math, arr);
    var min = Math.min.apply(Math, arr);
    return arr.map(num => (scaledMax-scaledMin)*(num-min)/(max-min)+scaledMin);
  };


  Visualize.prototype.generateUserData = function(){
    var featureLength = this.x[0].length;
    var results = [];
    var x = this.x.map(function(value, index){
      return value[0];
    });
    if (featureLength<2){
      var y = this.x.map(function(value, index){
        return 0;
      });
    } else {
      var y = this.x.map(function(value, index){
        return value[1];
      });
    }
    x = this.scaleBetween(x,100,600);
    y = this.scaleBetween(y,100,600);

    for (var i = 0;i < this.x.length; i++){
      var result = {};
      result.x = x[i];
      result.y = y[i];
      result.label = this.y[i];
      results.push(result);
    }
    console.log(results);
    return results;
  };

  Visualize.prototype.drawCircle = function(container, p, r, color) {
    var circle = container.append("circle")
      .attr("cx", p.x).attr("cy", p.y).attr("r", r)
      .attr("stroke", "#000").attr("stroke-width", 1).attr("fill", color);
    return circle;
  };

  Visualize.prototype.drawLine = function(container, p1, p2, color) {
    var line = container.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y).style("stroke", color).style("stroke-width", 2);
    return line;
  };

  Visualize.prototype.generate_data = function(size, range, labels) {
    var i = 0;
    var results = [];
    for (; i < size; i++) {
      var result = {};
      result.x = Math.random() * range;
      result.y = Math.random() * range;
      result.label = Math.floor(Math.random() * labels);
      results.push(result);
    }
    console.log(results);
    return results;
  };

  Visualize.prototype.get_distance = function(p1, p2) {
    var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    return d;
  };

  Visualize.prototype.get_knn = function(current, points, k) {
    var dists = [];
    var self = this;
    points.map(function(item) {
      var result = {};
      result.p = item;
      result.d = self.get_distance(current, item.data);
      dists.push(result);
    });

    dists.sort(function(a, b) {
      return a.d - b.d;
    });

    return dists.slice(0, k);
  };

  Visualize.prototype.get_vote = function(knn) {
    var result = [];
    var length = this.category;
    for (var i =0; i < length; i++) {
      result[i] = {};
      result[i].label = i;
      result[i].value = 0;
    }
    knn.map(function(item){
      console.log(item);
      result[item.p.data.label].value++;
    });

    result.sort(function(a, b) {
      return b.value - a.value;
    });

    return result[0].label;
  };

   Visualize.prototype.showCanvas = function() {

    $("#chart").show();
    var root = this.d3.select("#chart").append("svg").attr("width", this.range).attr("height", this.range);
    var layer1 = root.append("g").attr("id", "layer1");
    if (this.knn != undefined){
      var data = this.generateUserData();
    } else {
      var data = this.generate_data(this.size, this.range, this.category);
    }
    console.log(data);
    var points = [];
    var self = this;
    data.map(function(item) {
      var point = self.drawCircle(root, item, 5, self.colors(item.label));
      var p = {};
      p.data = item;
      p.el = point;
      points.push(p);
    });
    root.on("mouseover", function(d) {
      $("#layer1").empty();
      var mouse_point = self.d3.mouse(root.node());
      var current_point = {};
      current_point.x = mouse_point[0];
      current_point.y = mouse_point[1];

      if ( current_point.x < 0 || current_point.x > this.range || current_point.y < 0 || current_point.y > this.range ) {
        return;
      }

      var knn = self.get_knn(current_point, points, self.k);
      var d_max = knn[knn.length-1].d;
      var vote = self.get_vote(knn);

      knn.map(function(item) {
        var line = self.drawLine(layer1, item.p.data, current_point, "#ddd");
      });

      var range_circle = self.drawCircle(layer1, current_point, d_max + 5, 'None');
      range_circle.style("fill","#ccc").style("fill-opacity",0.8).attr("stroke-width", 0);

      var predict_circle = self.drawCircle(layer1, current_point, 8, self.colors(vote));
      });
  };

  module.exports = Visualize;
