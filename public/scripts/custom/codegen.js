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


//customize console.log
console.webLog = (function (old_function,div_id) {
    return function (text) {
        old_function(text);
        $(div_id).append('<pre class="block">' + text + '</pre>');
    };
} (console.log.bind(console), "#console_javascript"));


