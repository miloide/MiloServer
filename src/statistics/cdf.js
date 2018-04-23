var pmf = require('./pmf').pmf;
var makeHistFromList = require('./pmf').makeHistFromList;
var zip = require('../datasets').zip;


/**
*   Represents a cumulative distribution function.

    @param xs: sequence of values
    @param ps: sequence of probabilities
    @param name: string used as a graph label.
*/

function Cdf(xs = [], ps = [], name =''){
    this.xs = xs;
    this.ps = ps;
    this.name = name;
}

/**
 *  Allows maintaining sort order on insertion by providing the index to insert at
 *  @param val:
 */
Cdf.prototype.bisect = function (arr, val) {
    var idx;
    if (arr.length === 0) {
        return 0;
    }
    for (idx=0; idx < arr.length; idx++) {
        if (val < arr[idx]) {
            return idx;
        }
    }
    return idx;
};

/**
 * Inserts value to array and support inplace insertion
 */
Cdf.prototype.insert = function (arr, val, inPlace) {
    var idx = arr.bisect(arr, val);
    if (inPlace) {
        arr.splice(idx, 0, val); // splice takes index, number of items to delete from index, and items (array or number) to insert at index
        return this;
    }
    return arr.slice(0, idx).concat([val], arr.slice(idx));
};


Cdf.prototype.values = function(){
    return this.xs;
};

Cdf.prototype.probabilities = function(){
    return this.ps;
};

//Returns a sorted sequence of (value, probability) pairs
Cdf.prototype.items = function(){
    return zip([this.xs,this.ps]);
};

Cdf.prototype.append = function(x, p){
    this.xs.push(x);
    this.ps.push(p);
};

/**
 *  Returns CDF(x),iethe probability that corresponds to value x.
    @param x: number
    returns: float probability
 */
Cdf.prototype.probability = function(x){
    if(x < this.xs[0])
        return 0.0;
    var index = this.bisect(this.xs, x);
    var prob = this.ps[index-1];
    return prob;
};

/**
 *  Returns InverseCDF(p), the value that corresponds to probability p.
    @param p: number in the range [0, 1]
    returns: number value
 */

Cdf.prototype.inverse = function(p){
    if(p < 0 || p >1)
        throw "Probability p must be in range [0,1]";
    if(p == 0)
        return this.xs[0];
    if(p == 1)
        return this.xs[len(this.xs)];
    index = this.bisect(this.ps, p);
    if(p == this.ps[index-1])
        return this.xs[index-1];
    else
        return this.xs[index];
};

/**
 *  Returns the value that corresponds to percentile p.
    @param p: number in the range [0, 100]
    returns:number value
 */

Cdf.prototype.percentile = function(p){
    return this.inverse(p/100.0);
};
//Chooses a random value from this distribution
Cdf.prototype.random = function(){
    return this.inverse(Math.random());
};

/**
 *  Generates a random sample from this distribution.
    @param n: int length of the sample
 */
Cdf.prototype.sample = function(n){
    this.random = [];
    for (var i = 0;i < n; i++){
        this.random.push(Math.random());
    }
    return this.random;
};

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
};

/**
 *  Generates a sequence of points suitable for plotting.
    An empirical CDF is a step function; linear interpolation
    can be misleading.
    returns:tuple of (xs, ps)
 */
Cdf.prototype.render = function(label, colour){
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
    var code = '{\n'+
        '"type":"scatter",\n'+
        '"name":"'+ label +'"'+
        ',\n"x":'+ xs +
        ',\n"y":'+ ps +
        ',\n"line": {"color":"'+ colour +'"}'+
        ',\n"lineOnly": true,' +
        '\n},\n'
    ;
    return code;
};

function MakeCdfFromItems(items, name=''){
    var sum = 0.0;
    var xs = [];
    var cs = [];
    for(var i = 0; i < items.length; i++){
        sum += items[i][1];
        xs.push(items[i][0]);
        cs.push(sum);
    }
    var total = parseFloat(sum);
    var ps = [];
    for(var c in cs)
        ps.push(cs[c]/total);
    cdf = new Cdf(xs,ps,name);
    return cdf;
};

function MakeCdfFromHist(hist, name=''){
    return MakeCdfFromItems(hist.dictwrapper.getPair());
};

function makeCdfFromPmf(pmf,name=''){
    if(name=''){
        name=pmf.dictwrapper.name;
    }
    return MakeCdfFromItems(pmf.dictwrapper.getPair(), name);
};

function MakeCdfFromList(seq,name=''){
    var hist = makeHistFromList(seq);
    return MakeCdfFromHist(hist,name);
};

module.exports = {
    Cdf,
    makeCdfFromPmf,
    MakeCdfFromHist,
    MakeCdfFromItems,
    MakeCdfFromList,
    zip,
};
