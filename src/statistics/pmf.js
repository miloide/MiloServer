function DictWrapper(dict=undefined, name = ''){
    if(dict == undefined){
        dict = {};
    }
    this.dict = dict;
    this.name = name;
}

DictWrapper.prototype.getDict = function(){
    return this.dict;
}

DictWrapper.prototype.values = function(){
    return Object.keys(this.dict);
}

DictWrapper.prototype.items = function(){
    var values = Object.keys(this.dict).map(function(key){
        return this.dict[key];
    });
    return values 
}

DictWrapper.prototype.render = function(){
    var sorted = [];
    for(var key in this.dict){
        sorted[sorted.length] = this.dict[key];
    }
    return sorted.sort();
}

DictWrapper.prototype.print = function(){
    for (var key in this.dict){
        console.log(key, this.dict[key]);
    }
}

DictWrapper.prototype.set = function(x, y = 0){
    this.dict[x] = y;
}

DictWrapper.prototype.incr = function(x, term = 1){
    this.dict[x] = this.dict[x] + term;
} 

DictWrapper.prototype.mult = function(x, factor){
    this.dict[x] = this.dict[x]*factor;
}

DictWrapper.prototype.remove = function(x){
    delete this.dict[x];
}

DictWrapper.prototype.total = function(){
    var sum = 0;
    for( var key in this.dict ) {
        if(this.dict.hasOwnProperty(key)) {
            sum += parseFloat(this.dict[key]);
            }
        }
  return sum;
}

DictWrapper.prototype.maxLike = function(){
   return Object.keys(this.dict).reduce(function(a, b){ return this.dict[a] > this.dict[b] ? this.dict[a] : this.dict[b] });
}

function Pmf(dict, name=''){
    DictWrapper.call(dict,name);
}

Pmf.prototype.copy = function(name = undefined){
    if(name == undefined){
        this.name = name;
        
    }
    return new Pmf(new dict(this.dict),name);
}

Pmf.prototype.probs = function(){
    return this.values();
}

Pmf.prototype.prob = function(x){
    return this.d[x];
}

Pmf.prototype.normalize = function(fractino = 1.0){
    var total = this.total();
    if(total == 0.0){
        throw "Total probability is zero";
        return;
    }

    factor = parseFloat(fractino/total);
    for(var x in this.d){
        if(this.d.hasOwnProperty(x)){
            this.d[x]*=factor;
        }
    }
}

Pmf.prototype.random = function(){
    if(Object.keys(this.d).length == 0){
        throw "Pmf contains no value";
    }

    target = Math.random();
    total = 0.0;
    for(var key in this.d){
        if(this.d.hasOwnProperty(key)){
            total+=this.d[key];
            if(total>=target)
                return key;
        }
    }
}

Pmf.prototype.mean = function(){
    mean = 0.0;
    for(var key in this.d){
        mean+=key*this.d[key];
    }
    return mean;
}

Pmf.prototype.variance = function(mean = undefined){
    if(mean == undefined){
        mean = this.mean();
    }
    var  variance = 0.0;    
      for(var key in this.d){
        variance += this.d[key]*Math.pow((key-mean),2);
    }
    return variance;
}
Pmf.prototype.log = function(){
      
      max = this.maxLike();
      for(var key in this.d){
         this.set(key, Math.log(this.d[key]/max));
    }    
}
Pmf.prototype.exp = function(){
      
      max = this.maxLike();
      for(var key in this.d){
         this.set(key, Math.exp(this.d[key]/max));
    }    
}

function Hist(dict, name=''){
     DictWrapper.call(dict,name);
}

Hist.prototype.copy = function(name = undefined){
    if(name == undefined){
        name = this.name;
    }
    return Hist(new dict(this.dict),name);
}

Hist.prototype.freq = function(x){
    return this.d[x];
}

Hist.prototype.freqs = function(){
   return this.values();
}

function makeHistFromList(t, name =''){
    hist = new Hist(name=name);
    for(var x in t){
        hist.incr(x);
    }
    return hist;
}

function makeHistFromDict(d, name=''){
    return new Hist(d, name);
}

function makePmfFromList(t, name=''){
    hist = makeHistFromList(t,name);
    return makeHistFromHict(hist);
}

function makePmfFromDict(d, name=''){
    pmf = new Pmf(d, name);
    pmf.normalize();
    return pmf;
}

function makePmfFromHist(hist, name = undefined){
    if(name == undefined){
        name = hist.name;
    }
    d = dict(hist.getDict());
    pmf = Pmf(d, name);
    pmf.normalize();
    return pmf;
}

function makePmfFromCdf(cdf, name=undefined){
    if(name == undefined){
        name = cdf.name;
    }
    pmf = new Pmf(name = name);
    prev = 0.0;
    items = cdf.items();
    for(var key in items){}
        pmf.incr(items[key], prob-prev);
        prev = prob;
    }
    return pmf;
}

function makeMixture(pmfs, name='mix'){
    mix = new Pmf(name=name);
    items = pmfs.items();
    for(var key in items){
        for
    }
}
