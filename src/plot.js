var Pmf = require('./statistics/pmf');
var Helpers = require('./helpers');
/**
 * Creates a class for Plot operations
 * @class
 **/

function Plot() {

    this.div_ = document.createElement("div");
    var divId = Blockly.JavaScript.variableDB_.getDistinctName(
        'plotDiv', Blockly.Variables.NAME_TYPE);
    this.div_.setAttribute("id",divId);
    /**
     * @member {Object[]} data_ stores a list of data objects, each containining x,y  coordinates for plotting
     * Sample Data object:
       var datasetA = {
                x: [1.5, 2.5, 3.5, 4.5, 5.5], // x-coordinates
                y: [4, 1, 7, 1, 4], // y-coordinates
                mode: 'markers',  //Any combination of "lines", "markers", "text" joined with "+" or "none".
                type: 'scatter',  //eg: scatter,histogram,box
                name: 'Line A',
                text: ['A1', 'A2', 'A3', 'A4', 'A5'],
                marker: { symbol: "circle" } // eg: "circle","square","cross","triange","star"
            };
            var datasetB = {...};
        this.data_ = [datasetA,datasetB];
        //produces a single plot with values from A and B in different colors
    */

    this.data_ = [];
    /**
     * @member {object} layout_ stores configuration of plot's title, x,y axis, etc
     */
    this.layout_ = {
        title:'Untitled Plot',
        xaxis:{},
        yaxis:{},
        showlegend:true

    };

    /**
     * canvas_ stores the parent div for plot outputs
     */
    this.canvas_ = document.getElementById("graph_output");
}

/**
 * Add a dataset object to Plot.data_
 * @param {Object} data - object containing dataset and plot parameters for this dataset
 * @param {number[]} data.x - x-axis values as array
 * @param {number[]} data.y - y-axis values as array
 * @param {string} data.type - scatter,or histogram,etc - default is scatter
 * @param {string} data.name - data label
 * @param {string} data.color - color for use while plotting
 * @param {string} data.isLine - whether to draw line through points or not
 */
Plot.prototype.addDataItem = function(data) {
    if (data.x == undefined && data.name == "Function"){
        var minRange = data.min == undefined? -10 :data.min;
        var maxRange = data.max == undefined? 10 :data.max;
        var incRange = data.inc == undefined? 1 :data.inc;
        var x_ = [], y_ = [];
        var x;
        for (var itr = minRange; itr < maxRange; itr +=incRange){
            x_.push(itr);
            x = itr;
            y_.push(eval(data.Function));
        }
        data.x = x_;
        data.y = y_;
    }

    if (data.x == undefined && data.y == undefined) {
            Helpers.showAlert("Error", "Not enough data to plot!");
            return;
    }

    if (data.type == "scatter") {
        if (data.x == undefined || data.y == undefined){
          Helpers.showAlert("Error", "Not enough data");
          return;
        }
    }
    data.marker["symbol"] = "circle";
    if (data.marker["color"] == "#ffffff") data.marker["color"] = undefined;
    if (data.group != undefined && data.group.length){
        var hist = Pmf.makeHistFromList(data.group);
        var keys = hist.dictwrapper.values();
        var key2color = {}
        for (var i in keys) key2color[keys[i]] = i+1;
        var color = [];
        for (var i in data.group) color.push(key2color[data.group[i]]);
        data.marker["color"] = color;
        data.text = data.group;
    }
    if(data.type == "scatter") data.mode = data.isLine?"markers+lines":"markers";
    this.data_.push(data);
    return true;
};

/**
 * Sets the plot title to given string argument
 * @param {string} title
 */
Plot.prototype.setTitle = function(title) {
    this.layout_.title = title;
};

/**
 * Sets the label for X-Axis
 * @param {string} label
 */
Plot.prototype.setXLabel= function(label) {
    this.layout_.xaxis.title = label;
};

/**
 * Sets the label for Y-Axis
 * @param {string} label
 */
Plot.prototype.setYLabel= function(label) {
    this.layout_.yaxis.title = label;
};

/**
 * Displays the plot in UI
 * TODO (arjun): Add checks for ensuring data existence
 */
Plot.prototype.show = function() {
    $(this.canvas_).prepend(this.div_);
    var d3 = Plotly.d3;
    var WIDTH_IN_PERCENT_OF_PARENT = 540;
    var HEIGHT_IN_PERCENT_OF_PARENT = 80;
    const gd3 = d3.select("#"+this.div_.getAttribute("id"))
                .append('div')
                .style({
                    width: WIDTH_IN_PERCENT_OF_PARENT + '%',
                    //height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
                });
    const gd = gd3.node();
    Plotly.newPlot(gd,this.data_, this.layout_);
    gd.setAttribute("style","");
    Plotly.Plots.resize(gd);
    //Add the Plotly div to the canvas
    $("#graph_output").show();
};

/**
 * Sets data for plot
 * @param {Object[]} data
 */
Plot.prototype.setData = function(data){
    for (var index in data){
        this.addDataItem(data[index]);
    }
};

/**
 * Sets options for plot layout
 * @param {Object[]} options
 */
Plot.prototype.setOptions = function(options){
    for (var index in options){
        switch (options[index].type){
            case "plot_title":
                this.setTitle(options[index].value);
                break;
            case "plot_xlabel":
                this.setXLabel(options[index].value);
                break;
            case "plot_ylabel":
                this.setYLabel(options[index].value);
                break;
        }
    }
};

/**
 * Returns a graphDiv suitable for plotting reactive graphs
 */
Plot.prototype.reactive = function() {
    $("#graph_output").show();
    $(this.canvas_).prepend(this.div_);
    var d3 = Plotly.d3;
    var WIDTH_IN_PERCENT_OF_PARENT = 540;
    var HEIGHT_IN_PERCENT_OF_PARENT = 80;
    const gd3 = d3.select("#"+this.div_.getAttribute("id"))
                    .append('div')
                    .style({
                        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
                        //height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
                    });
    const gd = gd3.node();
    gd.setAttribute("style","");
    return gd;

};


module.exports = Plot;