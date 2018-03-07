Array.prototype.bisect = function (val) {
    var idx;
    if (this.length === 0) {
        return 0;
    }
    for (idx=0; idx < this.length; idx++) {
        if (val < this[idx]) {
            return idx;
        }
    }
    return idx;
};

Array.prototype.insert = function (val, inPlace) {
    var idx = this.bisect(val);
    if (inPlace) {
        this.splice(idx, 0, val);
        return this;
    }
    return this.slice(0, idx).concat([val], this.slice(idx));
};

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

function Cdf(xs = undefined, ps = undefined, name =''){
    if(xs == undefined)
        this.xs = [];
    if(ps == undefined)
        this.ps = [];    
    this.name = name;    
}

Cdf.prototype.values = function(){
    return this.xs;
}

Cdf.prototype.items = function(){

}

Cdf.prototype.append = function(x, p){
    this.xs.push(x);
    this.ps.push(p);
}

Cdf.prototype.prob = function(x){
    if(x < this.x[0])
        return 0.0;
    var index = this.xs.bisect(x);
    var prob = this.ps[index];
    return prob;
}

Cdf.prototype.value = function(p){
    if(p < 0 || p >1)
        throw "Probability p must be in range [0,1]";
    if(p == 0)
        return this.xs[0];
    if(p == 1)
        return this.xs[len(this.xs)];
    index = this.ps.bisect(p);
    if(p == this.ps[index-1])
        return this.xs[index-1];
    else
        return this.xs[index];        
}

Cdf.prototype.percentile = function(p){
    return this.value(p/100.0);
}

Cdf.prototype.random = function(){
    return this.value(Math.random());
}

Cdf.prototype.sample = function(n){
    this.random = [];
    for(var i = 0;i < n; i++){
        this.random.push(Math.random());
    }
    return this.random;
}

Cdf.prototype.mean = function(){
    var old_p = 0;
    var total = 0.0;
    var zipped_arr = zip([this.xs,this.ps])
    for(var i = 0;i < len(zipped_arr[0]);i++ ){
        var p = zipped_arr[1][i] - old_p;
        total+=p*zipped_arr[0][i];
        old_p = p;
    }
    return total;
}

Cdf.prototype.render = function(){
    
    var xs = [this.xs[0]];
    ps = [0.0];
    var iterator = this.ps.entries();
    for(let it of iterator){
        xs.push(this.xs[it[0]]);
        ps.push(it[1]);
        
        try{
            xs.push(this.xs[it[0]+1]);
            ps.push(it[1]);
        }
        catch(err){
            throw err;
        }
    }
    return [xs,ps];
}

function MakeCdfFromItems(items, name=''){
    var sum = 0.0;
    xs = [];
    cs = [];
    for(var item in items.sort()){
        sum += item[1];
        xs.push(item[0]);
        cs.push(sum);
    }
    var total = parseFloat(sum);
    var ps = [];
    for(var c in cs)
        ps.push(c/total);
    cdf = new Cdf(xs,ps,name);
    return cdf;
}
function MakeCdfFromHist(hist, name=''){
    return MakeCdfFromItems(hist.dictwrapper.getPair());
}

function makeCdfFromPmf(pmf,name=''){
    if(name=''){
        name=pmf.dictwrapper.name;
    }
    return MakeCdfFromItems(pmf.dictwrapper.getPair(), name);
}

function MakeCdfFromList(seq,name=''){
    var hist = makeHistFromList(seq);
    return MakeCdfFromHist(hist,name);
}
module.exports = {
    makeCdfFromPmf,
    MakeCdfFromHist,
    MakeCdfFromItems,
    MakeCdfFromList,
    zip,
    Cdf
};