function DictWrapper(dict, name = ''){
    if(dict == undefined){
        this.dict = {};
    }
    else
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
    if(!(x in this.dict))
        this.dict[x]=1;
    else    
        this.dict[x] = this.dict[x]+term;
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
    
    this.dictwrapper = new DictWrapper(dict,name);
}

Pmf.prototype.copy = function(name = undefined){
    if(name == undefined){
        this.dictwrapper.name = name;
        
    }
    return new Pmf(new dict(this.dict),name);
}

Pmf.prototype.probs = function(){
    return this.dictwrapper.values();
}

Pmf.prototype.prob = function(x){
    return this.dictwrapper.dict[x];
}

Pmf.prototype.normalize = function(fractino = 1.0){
    var total = this.dictwrapper.total();
    if(total == 0.0){
        throw "Total probability is zero";
        return;
    }

    factor = parseFloat(fractino/total);
    for(var x in this.dictwrapper.dict){
        if(this.dictwrapper.dict.hasOwnProperty(x)){
            console.log(this.dictwrapper.dict[x]);
            this.dictwrapper.dict[x]*=factor;
        }
    }
}

Pmf.prototype.random = function(){
    if(Object.keys(this.dictwrapper.dict).length == 0){
        throw "Pmf contains no value";
    }

    target = Math.random();
    total = 0.0;
    for(var key in this.dictwrapper.dict){
        if(this.dictwrapper.dict.hasOwnProperty(key)){
            total+=this.dictwrapper.dict[key];
            if(total>=target)
                return key;
        }
    }
}

Pmf.prototype.mean = function(){
    mean = 0.0;
    for(var key in this.dictwrapper.dict){
        mean+=key*this.dictwrapper.dict[key];
    }
    return mean;
}

Pmf.prototype.variance = function(mean = undefined){
    if(mean == undefined){
        mean = this.mean();
    }
    var  variance = 0.0;    
      for(var key in this.dictwrapper.dict){
        variance += this.dictwrapper.dict[key]*Math.pow((key-mean),2);
    }
    return variance;
}
Pmf.prototype.log = function(){
      
      max = this.maxLike();
      for(var key in this.dictwrapper.dict){
         this.set(key, Math.log(this.dictwrapper.dict[key]/max));
    }    
}
Pmf.prototype.exp = function(){
      
      max = this.maxLike();
      for(var key in this.dictwrapper.dict){
         this.set(key, Math.exp(this.dictwrapper.dict[key]/max));
    }    
}

function Hist(dict, name=''){
     this.dictwrapper = new DictWrapper(dict,name);
}

Hist.prototype.copy = function(name = undefined){
    if(name == undefined){
        dictwrapper.name = this.name;
    }
    return Hist(new dict(this.dictwrapper.dict),name);
}

Hist.prototype.freq = function(x){
    return this.dictwrapper.dict[x];
}

Hist.prototype.freqs = function(){
   return this.dictwrapper.values();
}

function makeHistFromList(t, name =''){
    hist = new Hist(dict={}, name=name);
    for(var x in t){
        hist.dictwrapper.incr(t[x]);
    }
    return hist;
}

function makeHistFromDict(d, name=''){
    return new Hist(d, name);
}

function makePmfFromList(t, name=''){
    hist = makeHistFromList(t,name);    
    return makePmfFromHist(hist);
}

function makePmfFromDict(d, name=''){
    pmf = new Pmf(d, name);
    pmf.normalize();
    return pmf;
}

function makePmfFromHist(hist, name = undefined){
    if(name == undefined){
        name = hist.dictwrapper.name;
    }
    d = new Object(hist.dictwrapper.getDict());
    pmf = new Pmf(d, name);
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
    for(var key in items){
        pmf.incr(items[key], prob-prev);
        prev = prob;
    }
    return pmf;
}

module.exports = {
    Pmf,
    DictWrapper,
    Hist,
    makeHistFromList,
    makePmfFromList,
    makePmfFromHist
};