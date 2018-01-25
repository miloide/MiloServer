Blockly.JavaScript.text_log = function(a) {
    return "console.webLog(" + (Blockly.JavaScript.valueToCode(a, "TEXT", Blockly.JavaScript.ORDER_NONE) || "''") + ");\n"
};

Blockly.JavaScript.constant = function(a) {
    return[parseFloat(a.getFieldValue("NUM")),Blockly.JavaScript.ORDER_ATOMIC]
};

Blockly.JavaScript.createoptimizer = function(block){
    var optimizer = block.getFieldValue('optimizer');
    var rate = parseFloat(block.getFieldValue('rate'));
    var numBatches = parseInt(block.getFieldValue('numBatches'));
    var batchSize = parseInt(block.getFieldValue('batchSize'));
    var code =  'const rate = '+ rate +';' +'const optimizer = '+ 'new dl.'+optimizer+'(rate)' + ';'  + '\n' + 'const numBatches = '+ numBatches+';' +'\n'+ 'const batchSize = ' + batchSize+';' + '\n' ;
    return code;
};

Blockly.JavaScript['dataset_1'] = function(block) {
        var code = 'var inputX = []; \n var inputY = []; \n for(var i=0;i<1000;i++) \n { const arrX = dl.Array1D.new([i]); const arrY = dl.Array1D.new([i*2]); \n inputX.push(arrX);\n inputY.push(arrY); \n }';
        var code1 = '\n var noAttributes = 1; \n ';
        return code+code1;
  };

Blockly.JavaScript['linearregression'] = function(block){
        //TODO(Ayush): Split this into native blocks as much as possible
        var code = 'const inputShape = [noAttributes]; \n const inputTensor = graph.placeholder' + '(' + '\'input\'' + ',inputShape); \n ';
        var code1 = '\n const labelShape = [1]; \n const multiplier = graph.variable' + '(' + '\'multiplier\'' + ', dl.Array2D.randNormal([1, noAttributes])); \n const labelTensor = graph.placeholder ' + '(' + '\'label\''+ ', labelShape); \n const outputTensor = graph.matmul(multiplier, inputTensor);';
        var code2 = '\n const costTensor = graph.meanSquaredCost(outputTensor, labelTensor); \n var shuffledInputProviderBuilder = new dl.InCPUMemoryShuffledInputProviderBuilder([inputX, inputY]); \n var _a = shuffledInputProviderBuilder.getInputProviders(), inputProvider = _a[0], labelProvider = _a[1];';
        var code3 = '\n var FeedEntry = [{tensor: inputTensor, data: inputProvider},{tensor: labelTensor, data: labelProvider}];';
        var code4 = ' \n for(let j=0;j < numBatches;j++) \n { const cost = session.train(costTensor, FeedEntry, batchSize, optimizer, dl.CostReduction.MEAN); \n console.log(j,cost.getValues());}';
        return code+code1+code2+code3+code4;
};

Blockly.JavaScript['predict'] = function(block) {
    var number_testx = parseFloat(block.getFieldValue('testX'));
    var test = ' var test =  dl.Array1D.new([' +number_testx+'])' +';';
    var code = 'const result = session.eval(outputTensor,[{tensor: inputTensor, data:test}]); result.data().then(data=> alert(data));';
    return test+code;
};

Blockly.JavaScript['dl_number'] = function(block) {
    var arg0 = parseFloat(block.getFieldValue("NUM"));
    var code = "dl.Scalar.new(" + arg0 +")";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dl_get_scalar'] = function(block) {
    var zero = "dl.Scalar.new(0)";
    arg0 = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC) || zero;
    var code = arg0+".get()";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dl_arithmetic'] = function(block) {
    // Basic arithmetic operators, and power.
    var OPERATORS = {
      'ADD': ['math.add', Blockly.JavaScript.ORDER_ADDITION],
      'MINUS': ['math.subtract', Blockly.JavaScript.ORDER_SUBTRACTION],
      'MULTIPLY': ['math.multiply', Blockly.JavaScript.ORDER_MULTIPLICATION],
      'DIVIDE': ['math.divide', Blockly.JavaScript.ORDER_DIVISION],
    };
    var tuple = OPERATORS[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
    var code;
    code = operator+'(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript.img_from_url = function(block) {
    var arg0 = Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) || "''";
    var code = 'imgFromURL('+ arg0 +')';
    return [code,Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.img_from_webcam = function(block) {
    var code = 'WebCam.image';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.squeezenet_label = function(block) {
    const zero = "";
    var arg0 = Blockly.JavaScript.valueToCode(block, 'IMG', Blockly.JavaScript.ORDER_NONE) || zero;
    if (arg0 == zero) return ["",Blockly.JavaScript.ORDER_ATOMIC];
    var code = 'SqueezeNet.classify(\n\t'+ arg0 +'\n);\n';
    return code;
};

Blockly.JavaScript.img_show = function(block) {
    const zero = "";
    var arg0 = Blockly.JavaScript.valueToCode(block, 'IMG', Blockly.JavaScript.ORDER_NONE) || zero;
    if (arg0 == zero) return ["",Blockly.JavaScript.ORDER_ATOMIC];
    var code = '\nimgShow('+ arg0 +');\n';
    return code;
};

// TODO (arjun): Actual Plot Generation Code.
Blockly.JavaScript['plot_scatter'] = function(block) {
    var value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
    var value_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var colour_hue = block.getFieldValue('HUE');
    var checkbox_connect = block.getFieldValue('Connect') == 'TRUE';
    // TODO: Assemble JavaScript into code variable.
    var code = '{\n'+
        '"type":"scatter",\n'+
        '"name":"'+ value_name +'"'+
        ',\n"x":'+ value_x +
        ',\n"y":'+ value_y +
        ',\n"isLine":'+ checkbox_connect +
        '\n},\n'
    ;
    return code;
  };

Blockly.JavaScript['plot_histogram'] = function(block) {
var data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
var colour_hue = block.getFieldValue('HUE');
// TODO: Assemble JavaScript into code variable.
var code = '...;\n';
return code;
};

Blockly.JavaScript['plot_title'] = function(block) {
var text_name = block.getFieldValue('NAME');
// TODO: Assemble JavaScript into code variable.
var code = '{\n\t"type":"plot_title",\n\t"value":"'+text_name+'"\n},\n';
return code;
};

Blockly.JavaScript['plot_x_title'] = function(block) {
var text_name = block.getFieldValue('NAME');
// TODO: Assemble JavaScript into code variable.
var code = '{\n\t"type":"plot_xlabel",\n\t"value":"'+text_name+'"\n},\n';
return code;
};

Blockly.JavaScript['plot_y_title'] = function(block) {
var text_name = block.getFieldValue('NAME');
// TODO: Assemble JavaScript into code variable.
var code = '{\n\t"type":"plot_ylabel",\n\t"value":"'+text_name+'"\n},\n';
return code;
};

Blockly.JavaScript['show_plot'] = function(block) {
    var statements_data = Blockly.JavaScript.statementToCode(block, 'DATA');
    var statements_options = Blockly.JavaScript.statementToCode(block, 'Options');
    var plotVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'plot', Blockly.Variables.NAME_TYPE);

    var newPlot = "var "+ plotVar +" = new Plot();";
    var setData = plotVar +".setData([\n"+statements_data+"\n]);";
    var setOptions = statements_options.length!=0?plotVar +".setOptions([\n"+statements_options+"\n]);":"";
    var showPlot = plotVar +".show()";
    var code = [newPlot,setData,setOptions,showPlot].join("\n");
    return code;
  };


//TODO: (Arjun) Generate Math List
Blockly.JavaScript['lists_split_math'] = function(block) {
    // Block for splitting text into a list of numbers
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT',
        Blockly.JavaScript.ORDER_MEMBER);
    var delimiter = Blockly.JavaScript.valueToCode(block, 'DELIM',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    var mode = block.getFieldValue('MODE');
    if (mode == 'SPLIT') {
    if (!input) {
        input = '\'\'';
    }
    var functionName = 'split';
    } else if (mode == 'JOIN') {
    if (!input) {
        input = '[]';
    }
    var functionName = 'join';
    } else {
    throw 'Unknown mode: ' + mode;
    }
    var code = input + '.' + functionName + '(' + delimiter + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};