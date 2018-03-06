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
    var code =  '\n const rate = '+ rate +';' +'\n const optimizer = '+ 'new dl.'+optimizer+'(rate)' + ';'  + '\n' + '\n const numBatches = '+ numBatches+';' +'\n'+ '\n const batchSize = ' + batchSize+';' + '\n' ;
    return code;
};

Blockly.JavaScript['predict'] = function(block) {
    var number_testx = Blockly.JavaScript.valueToCode(block, "NUM", Blockly.JavaScript.ORDER_FUNCTION_CALL);
    var code = 'session.eval(outputTensor,[{tensor: inputTensor, data: dl.Array1D.new('+number_testx+')}])';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dl_number'] = function(block) {
    var arg0 = parseFloat(block.getFieldValue("NUM"));
    var code = "dl.Scalar.new(" + arg0 +")";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dl_array1d'] = function(block) {
    var arg0 = Blockly.JavaScript.valueToCode(block, "NUM", Blockly.JavaScript.ORDER_FUNCTION_CALL);
    var code = "dl.Array1D.new(" + arg0 +")";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dl_get_scalar'] = function(block) {
    var zero = "dl.Scalar.new(0)";
    arg0 = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC) || zero;
    var code = arg0+".dataSync()";
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

Blockly.JavaScript['probability_mass_function'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var plotVar = Blockly.JavaScript.variableDB_.getDistinctName(
    'plot', Blockly.Variables.NAME_TYPE);
  var code = value_name;
  return value_name;
};


Blockly.JavaScript['construct_pmf'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var pmfVar = Blockly.JavaScript.variableDB_.getDistinctName(
    'pmf', Blockly.Variables.NAME_TYPE);
  var code = dropdown_name + '(' + value_name +')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
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
        ',\n"marker": {"color":"'+ colour_hue +'"}'+
        ',\n"isLine":'+ checkbox_connect +
        '\n},\n'
    ;
    return code;
  };

Blockly.JavaScript['function_plot'] = function(block) {
  var expression = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var colour_hue = block.getFieldValue('HUE');
  var x_ = [], y_ = [];   
  for(var i = -10;i <= 10; i++){
      x_.push(i);
      x = i;
      y_.push(eval(expression));
  }
  var code = '{\n'+
        '"Function":'+ expression+
        '\n, "type":"scatter",\n'+
        '"name":"'+ "Function" +'"'+
        ',\n"x":['+ x_ +']'+
        ',\n"y":['+ y_ +']'+
        ',\n"marker": {"color":"'+ colour_hue +'"}'+
        ',\n"isLine":'+ true +
        '\n},\n'
;
  return code;
};

Blockly.JavaScript['plot_histogram'] = function(block) {
    var value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var colour_hue = block.getFieldValue('HUE');
    // TODO: Assemble JavaScript into code variable.
    var code = '{\n'+
        '"type":"histogram",\n'+
        '"name":"'+ value_name +'"'+
        ',\n"x":'+ value_x +
        ',\n"marker": {"color":"'+ colour_hue +'"},'+
        '\n},\n'
    ;
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

Blockly.JavaScript['dataconfiguration'] = function(block) {
    var value_noattributes = Blockly.JavaScript.valueToCode(block, 'noAttributes', Blockly.JavaScript.ORDER_ATOMIC);
    var value_labelshape = Blockly.JavaScript.valueToCode(block, 'labelShape', Blockly.JavaScript.ORDER_ATOMIC);
    var inputTensor = '\n var inputTensor = graph.placeholder(\'input\',[' +  value_noattributes  + ']);';
    var multiplier = '\n var multiplier = graph.variable(\'multiplier\', dl.Array2D.randNormal([1,' +value_noattributes+']));';
    var labelTensor = '\n var labelTensor =  graph.placeholder(\'label\','+ value_labelshape+');';
    var outputTensor = '\n var outputTensor = graph.matmul(multiplier, inputTensor);';
    var costTensor = '\n var costTensor = graph.meanSquaredCost(outputTensor, labelTensor);';
    var code = inputTensor+multiplier+labelTensor+outputTensor+costTensor;
    return code;
  };

Blockly.JavaScript['dl_feedentry'] = function(block) {
    var value_inuptx = Blockly.JavaScript.valueToCode(block, 'inuptX', Blockly.JavaScript.ORDER_ATOMIC);
    var value_inputy = Blockly.JavaScript.valueToCode(block, 'inputY', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_costfunction = block.getFieldValue('costFunction');
    // TODO: Assemble JavaScript into code variable.
    var costFunction = '\nvar costFunction = dl.CostReduction.' + dropdown_costfunction +';';
    var shuffledInputProviderBuilder =  '\nvar shuffledInputProviderBuilder = new dl.InCPUMemoryShuffledInputProviderBuilder([' + value_inuptx + ','+  value_inputy +']);';
    var _a = '\nvar _a = shuffledInputProviderBuilder.getInputProviders(), inputProvider = _a[0], labelProvider = _a[1];';
    var FeedEntry = '\nvar FeedEntry = [{tensor: inputTensor, data: inputProvider},{tensor: labelTensor, data: labelProvider}];\n';
    var code = costFunction + shuffledInputProviderBuilder + _a + FeedEntry;
    return code;
  };

  Blockly.JavaScript['train'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'var cost = session.train(costTensor, FeedEntry, batchSize, optimizer, costFunction);\n';
    return code;
  };

//TODO: (Arjun) Generate Math List
Blockly.JavaScript['lists_split_math'] = function(block) {
    // Block for splitting text into a list of numbers
    var input = Blockly.JavaScript.valueToCode(block, 'INPUT',
        Blockly.JavaScript.ORDER_MEMBER);
    var delimiter = Blockly.JavaScript.valueToCode(block, 'DELIM',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    if (!input) {
        input = '\'\'';
    }
    var functionName = 'split';
    var code = input + '.' + functionName + '(' + delimiter + ').map(Number)';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['lists_zip_with'] = function(block) {
    // Create a list with any number of elements of any type.
    var elements = new Array(block.itemCount_);
    for (var i = 0; i < block.itemCount_; i++) {
      elements[i] = Blockly.JavaScript.valueToCode(block, 'ADD' + i,
          Blockly.JavaScript.ORDER_COMMA) || 'null';
    }
    var code = 'Datasets.zip(' + elements.join(', ') + ')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['function_plot_x'] = function(block){
      var code = 'x';
      return code;
  }

