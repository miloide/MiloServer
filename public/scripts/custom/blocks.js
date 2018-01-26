// This file contains custom blocks and other customizations for Milo

// To change global colour brightness - set HSV Saturation and Value between 0(inclusive) and 1(exclusive);
Blockly.HSV_SATURATION = 0.60;
Blockly.HSV_VALUE = 0.75;

Blockly.Blocks['dataset_1'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Input Dataset - Iris");
      this.setColour(230);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    this.setTooltip("");
   this.setHelpUrl("");

    }
  };

Blockly.Blocks['linearregression'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("LinearRegression");
      this.setColour(230);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    this.setTooltip("");
   this.setHelpUrl("");
    }
  };


  Blockly.Blocks['optimizer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Optimizer to")
        .appendField(new Blockly.FieldDropdown([["SGD","SGDOptimizer"], ["Adagrad","Adagrad"], ["Adamax","Adamax"], ["Adam","Adam"]]), "optimizer");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    Blockly.BlockSvg.START_HAT = true;
	this.setPreviousStatement(true, null);
    this.setColour(Blockly.Msg.ML_HUE);
    this.setTooltip("Choose an optimizer");
    this.setHelpUrl("");
  }
};

var counter =0;
Blockly.Blocks['inputfile'] = {
  init: function() {
    this.setOnChange(function(event){
        if(event.type=="ui"){
            counter++;
            if(counter>2){
        console.log(event);
        //reader(event);
        $("#files").trigger("click");
            }
        }
    });
    this.appendDummyInput()
        .appendField("Click to Select input file");
    this.setColour(Blockly.Msg.ML_HUE);
    this.setTooltip("");
    this.setHelpUrl("");
    }
};

var openFile = function(event) {
  var input = event.target;
  console.log(event);
  var reader = new FileReader();
  reader.onload = function(){
    var text =String(reader.result).split("\n");
    console.log(text);
    nrows = text.length;
    if(text[0]!=null)
      noAttributes = text[0].split(",").length;
  var input_x = [];
  for(var i=0;i<nrows;i++)
  {
      var textArray =text[i].split(",");
      var intArray = [];
      for(var j=0;j<textArray.length;j++)
      {
          intArray[j] = parseInt(textArray[j]);
      }
     input_x.push(intArray);
  }
  inputs = input_x;
  console.log("Result:",inputs,noAttributes);
  return [input_x,noAttributes];
  };

  reader.readAsText(input.files[0]);
};


Blockly.Blocks['getvalue'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), "value");
    this.setOutput(true, null);
    this.setColour(Blockly.Msg.ML_HUE);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.Blocks['predict'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Predict for")
          .appendField(new Blockly.FieldNumber(0), "testX");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
Blockly.Blocks['createoptimizer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Optimizer to ")
        .appendField(new Blockly.FieldDropdown([["Adagrad","Adagrad"], ["SGD","SGDOptimizer"], ["Adam","Adam"]]), "optimizer");
    this.appendDummyInput()
        .appendField("with learning rate")
        .appendField(new Blockly.FieldNumber(0), "rate");
    this.appendDummyInput()
        .appendField("number of batches ")
        .appendField(new Blockly.FieldNumber(0), "numBatches");
    this.appendDummyInput()
        .appendField("batch size")
        .appendField(new Blockly.FieldNumber(0), "batchSize");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Msg.ML_HUE);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['mlparams'] = {
    init: function() {
        this.appendValueInput("VALUE")
            .setCheck("Number")
            .appendField("Set parameter")
            .appendField(new Blockly.FieldDropdown([["Learning Rate","learningRate"], ["Batch size","batchSize"], ["Number of batches","numBatches"]]), "paramters")
            .appendField("to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.Msg.ML_HUE);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks.text_log = {
    init: function() {
        this.jsonInit({
            message0: 'Log %1',
            args0: [{
                type: "input_value",
                name: "TEXT"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: Blockly.Blocks.texts.HUE,
            tooltip: Blockly.Msg.TEXT_PRINT_TOOLTIP,
            helpUrl: Blockly.Msg.TEXT_PRINT_HELPURL
        })
    }
};

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for numeric value.
    {
      "type": "dl_number",
      "message0": "%1",
      "args0": [{
        "type": "field_number",
        "name": "NUM",
        "value": 0
      }],
      "output": "DLnumber",
      "colour": "%{BKY_ML_HUE}",
      "helpUrl": "https://deeplearnjs.org/docs/api/classes/scalar.html",
      "tooltip": "A Deeplearn.js scalar",
      "extensions": ["parent_tooltip_when_inline"]
    },
    {
        "type": "dl_get_scalar",
        "message0": "ValueOf %1",
        "args0": [{
          "type": "input_value",
          "name": "NUM",
          "check": "DLnumber"
        }],
        "output": "Number",
        "colour": "%{BKY_ML_HUE}",
        "helpUrl": "https://deeplearnjs.org/docs/api/classes/ndarray.html#get",
        "tooltip": "Get raw value ",
        "extensions": ["parent_tooltip_when_inline"]
      },

    // Block for basic arithmetic operator.
    {
      "type": "dl_arithmetic",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "input_value",
          "name": "A",
          "check": "DLnumber"
        },
        {
          "type": "field_dropdown",
          "name": "OP",
          "options": [
            ["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
            ["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
            ["%{BKY_MATH_MULTIPLICATION_SYMBOL}", "MULTIPLY"],
            ["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"]
          ]
        },
        {
          "type": "input_value",
          "name": "B",
          "check": "DLnumber"
        }
      ],
      "inputsInline": true,
      "output": "DLnumber",
      "colour": "%{BKY_ML_HUE}",
      "helpUrl": "https://deeplearnjs.org/docs/api/classes/ndarraymath.html",
      "extensions": ["math_op_tooltip"]
    },
    {
    "type": "img_from_webcam",
    "message0": "Image From WebCam",
    "colour": "%{BKY_IMAGE_HUE}",
    "helpUrl": "",
    "output": "ImgDiv",
    "tooltip": "Gets image from WebCam",
    // "previousStatement": true,
    // "nextStatement": true,
    "extensions": ["parent_tooltip_when_inline"]
    },
    {
    "type": "img_from_url",
    "message0": "Image From URL %1",
    "args0": [{
        type: "input_value",
        name: "TEXT",
        check: "String"
    }],
    "colour": "%{BKY_IMAGE_HUE}",
    "helpUrl": "",
    "output": "ImgDiv",
    "tooltip": "Gets image from URL",
    // "previousStatement": true,
    // "nextStatement": true,
    "extensions": ["parent_tooltip_when_inline"]
    },
    {
        "type": "img_show",
        "message0": "Show %1",
        "args0": [{
            "type": "input_value",
            "name": "IMG",
            "check": "ImgDiv"
        }],
        "colour": "%{BKY_IMAGE_HUE}",
        "helpUrl": "",
        "previousStatement": true,
        "nextStatement": true,
        "tooltip": "Labels image using squeezenet Model",
        "extensions": ["parent_tooltip_when_inline"]
    },
    {
    "type": "squeezenet_label",
    "message0": "Using SqueezeNet",
    "message1": "Classify %1",
    "args1": [{
        "type": "input_value",
        "name": "IMG",
        "check": "ImgDiv"
    }],
    "colour": "%{BKY_ML_HUE}",
    "helpUrl": "",
    "previousStatement": true,
    "nextStatement": true,
    "tooltip": "Labels image using squeezenet Model",
    "extensions": ["parent_tooltip_when_inline"]
    },

    //TODO (arjun): Make colors as Blockly.Msg constants
    {
        "type": "plot_scatter",
        "lastDummyAlign0": "RIGHT",
        "message0": "Scatter %1 X %2 Y %3 Label %4 Color %5 %6 Draw Line %7",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_value",
            "name": "X",
            "check": "Array",
            "align": "RIGHT"
          },
          {
            "type": "input_value",
            "name": "Y",
            "check": "Array",
            "align": "RIGHT"
          },
          {
            "type": "input_value",
            "name": "NAME",
            "check": "String",
            "align": "RIGHT"
          },
          {
            "type": "field_colour",
            "name": "HUE",
            "colour": "#ffffff"
          },
          {
            "type": "input_dummy",
            "align": "RIGHT"
          },
          {
            "type": "field_checkbox",
            "name": "Connect",
            "checked": true
          }
        ],
        "inputsInline": false,
        "previousStatement": "Scatter",
        "nextStatement": "Scatter",
        "colour": "%{BKY_SCATTER_HUE}",
        "tooltip": "Set plot options",
        "helpUrl": ""
      },
      {
        "type": "plot_histogram",
        "lastDummyAlign0": "RIGHT",
        "message0": "Histogram Plot %1 X %2 Label %3 Color %4",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_value",
            "name": "DATA",
            "check": "Array",
            "align": "RIGHT"
          },
          {
            "type": "input_value",
            "name": "NAME",
            "check": "String",
            "align": "RIGHT"
          },
          {
            "type": "field_colour",
            "name": "HUE",
            "colour": "#ffffff"
          }
        ],
        "inputsInline": false,
        "previousStatement": "Histogram",
        "nextStatement": "Histogram",
        "colour": "%{BKY_HISTOGRAM_HUE}",
        "tooltip": "Histogram",
        "helpUrl": ""
      },
      {
        "type": "plot_title",
        "message0": "Set Plot Title %1",
        "args0": [
          {
            "type": "field_input",
            "name": "NAME",
            "text": "My Plot"
          }
        ],
        "previousStatement": "PlotConfig",
        "nextStatement": "PlotConfig",
        "colour": "%{BKY_PLOT_HUE}",
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "plot_x_title",
        "message0": "Set X Axis Label %1",
        "args0": [
          {
            "type": "field_input",
            "name": "NAME",
            "text": "My Plot"
          }
        ],
        "previousStatement": "PlotConfig",
        "nextStatement": "PlotConfig",
        "colour": "%{BKY_PLOT_HUE}",
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "plot_y_title",
        "message0": "Set Y Axis Label %1",
        "args0": [
          {
            "type": "field_input",
            "name": "NAME",
            "text": "My Plot"
          }
        ],
        "previousStatement": "PlotConfig",
        "nextStatement": "PlotConfig",
        "colour": "%{BKY_PLOT_HUE}",
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "show_plot",
        "message0": "Plot %1 Options %2",
        "args0": [
          {
            "type": "input_statement",
            "name": "DATA",
            "check": [
              "Scatter",
              "Histogram"
            ],
            "align": "RIGHT"
          },
          {
            "type": "input_statement",
            "name": "Options",
            "check": "PlotConfig"
          }
        ],
        "previousStatement":null,
        "colour": "%{BKY_PLOT_HUE}",
        "tooltip": "",
        "helpUrl": ""
      }

]);

Blockly.Blocks['constant'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("")
            .appendField(new Blockly.FieldNumber(0), "NUM");
        this.setColour(Blockly.Msg.ML_HUE);
        this.setOutput(true, null);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['lists_split_math'] = {
  /**
   * Block for splitting text into a list, or joining a list into text.
   * @this Blockly.Block
   */
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(
        [[Blockly.Msg.LISTS_SPLIT_LIST_FROM_TEXT, 'SPLIT'],
         [Blockly.Msg.LISTS_SPLIT_TEXT_FROM_LIST, 'JOIN']],
        function(newMode) {
          thisBlock.updateType_(newMode);
        });
    this.setHelpUrl(Blockly.Msg.LISTS_SPLIT_HELPURL);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('INPUT')
        .setCheck('String')
        .appendField(dropdown, 'MODE');
    this.appendValueInput('DELIM')
        .setCheck('String')
        .appendField(Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER);
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('MODE');
      if (mode == 'SPLIT') {
        return Blockly.Msg.LISTS_SPLIT_TOOLTIP_SPLIT;
      } else if (mode == 'JOIN') {
        return Blockly.Msg.LISTS_SPLIT_TOOLTIP_JOIN;
      }
      throw 'Unknown mode: ' + mode;
    });
  },
  /**
   * Modify this block to have the correct input and output types.
   * @param {string} newMode Either 'SPLIT' or 'JOIN'.
   * @private
   * @this Blockly.Block
   */
  updateType_: function(newMode) {
    if (newMode == 'SPLIT') {
      this.outputConnection.setCheck('Array');
      this.getInput('INPUT').setCheck('String');
    } else {
      this.outputConnection.setCheck('String');
      this.getInput('INPUT').setCheck('Array');
    }
  },
    /**
   * Create XML to represent the input and output types.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('mode', this.getFieldValue('MODE'));
    return container;
  },
  /**
   * Parse XML to restore the input and output types.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.updateType_(xmlElement.getAttribute('mode'));
  }
};


Blockly.Blocks['iris_get'] = {
  init: function() {
    this.setColour(Blockly.Msg.ML_HUE);
    this.appendDummyInput()
        .appendField("get")
        .appendField(new Blockly.FieldDropdown([
          ["Sepal length","Sepal length"],
          ["Sepal width","Sepal width"],
          ["Petal length","Petal length"],
          ["Petal width","Petal width"],
          ["Class","Class"]
        ]), 'GET')
    this.setInputsInline(false);
    this.setOutput(true, "Array");
  }
};