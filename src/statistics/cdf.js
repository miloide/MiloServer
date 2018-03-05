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
    this.xs.append(x);
    this.ps.append(p);
}

Cdf.prototype.prob = function(x){
    if(x < this.x[0])
        return 0.0;
    
}