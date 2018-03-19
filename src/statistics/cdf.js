
function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]});
    });
}
/** 
*   Represents a cumulative distribution function.

    @param xs: sequence of values
    @param ps: sequence of probabilities
    @param name: string used as a graph label.
*/

function Cdf(xs = undefined, ps = undefined, name =''){
    if(xs == undefined)
        this.xs = [];
    if(ps == undefined)
        this.ps = [];
    this.name = name;
}
Cdf.prototype.bisect = function (val) {
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

Cdf.prototype.insert = function (val, inPlace) {
    var idx = this.bisect(val);
    if (inPlace) {
        this.splice(idx, 0, val);
        return this;
    }
    return this.slice(0, idx).concat([val], this.slice(idx));
};

Cdf.prototype.vals = function(){
    return this.xs;
}

//Returns a sorted sequence of (value, probability) pairs
Cdf.prototype.items = function(){
    return zip([this.xs,this.ps]);
}

Cdf.prototype.append = function(x, p){
    this.xs.push(x);
    this.ps.push(p);
}

/**
 *  Returns CDF(x), the probability that corresponds to value x.
    @param x: number
    returns: float probability
 */
Cdf.prototype.prob = function(x){
    if(x < this.x[0])
        return 0.0;
    var index = this.xs.bisect(x);
    var prob = this.ps[index];
    return prob;

/**
 *  Returns InverseCDF(p), the value that corresponds to probability p.
    @param p: number in the range [0, 1]
    returns: number value
 */
Cdf.prototype.val = function(p){
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

/**
 *  Returns the value that corresponds to percentile p.
    @param p: number in the range [0, 100]
    returns:number value
 */

Cdf.prototype.percentile = function(p){
    return this.val(p/100.0);
}

//Chooses a random value from this distribution
Cdf.prototype.random = function(){
    return this.val(Math.random());
}

/**
 *  Generates a random sample from this distribution.
    @param n: int length of the sample
 */
Cdf.prototype.sample = function(n){
    this.random = [];
    for(var i = 0;i < n; i++){
        this.random.push(Math.random());
    }
    return this.random;
}

//omputes the mean of a CDF
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

/**
 *  Generates a sequence of points suitable for plotting.
    An empirical CDF is a step function; linear interpolation
    can be misleading.
    returns:tuple of (xs, ps)
 */
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