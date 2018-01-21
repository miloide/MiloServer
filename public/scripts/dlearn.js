'use strict';

/**
 * Create a namespace for Deeplearn.js related operations
 */

 var DeepLearn = {};

DeepLearn.setup = ' var dl = deeplearn; \n \
                    var graph = new dl.Graph(); \
                    \n var math = dl.ENV.math; \
                    \n var session =  new dl.Session(graph, math); \n';
