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
      "type": "dl_array1d",
      "message0": "Vector from %1",
      "args0": [{
        "type": "input_value",
        "name": "NUM",
        "check": "Array"
      }],
      "inputsInline": true,
      "output": "DLnumber",
      "colour": "%{BKY_ML_HUE}",
      "helpUrl": "https://deeplearnjs.org/docs/api/classes/array1d.html",
      "tooltip": "A Deeplearn.js Array1D",
      "extensions": ["parent_tooltip_when_inline"]
    },
    {
        "type": "dl_get_scalar",
        "message0": "Get Value %1",
        "args0": [{
          "type": "input_value",
          "name": "NUM",
          "check": "DLnumber"
        }],
        "output": "Number",
        "colour": "%{BKY_HISTOGRAM_HUE}",
        "helpUrl": "https://deeplearnjs.org/docs/api/classes/ndarray.html#get",
        "tooltip": "Get raw value ",
        "extensions": ["parent_tooltip_when_inline"]
      },

    // Block for basic arithmetic operator.
    {
      "type": "dl_arithmetic",
      "message0": "A %1 %2 %3 B %4",
      "args0": [
        {
          "type": "input_value",
          "name": "A",
          "check": "DLnumber",
          "align": "RIGHT"
        },
        {
          "type": "field_dropdown",
          "name": "OP",
          "options": [
            [
              "+",
              "ADD"
            ],
            [
              "-",
              "MINUS"
            ],
            [
              "×",
              "MULTIPLY"
            ],
            [
              "÷",
              "DIVIDE"
            ]
          ]
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "input_value",
          "name": "B",
          "check": "DLnumber",
          "align": "RIGHT"
        }
      ],
      "inputsInline": false,
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
            "name": "X",
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
   * Block for splitting text into a list, parsing values into Numbers
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LISTS_SPLIT_HELPURL);
    this.setColour(Blockly.Msg.LISTS_HUE);
    this.appendValueInput('INPUT')
        .setCheck('String')
        .appendField(Blockly.Msg.LISTS_SPLIT_ARRAY_FROM_TEXT);
    this.appendValueInput('DELIM')
        .setCheck('String')
        .appendField(Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER);
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.setTooltip("");
  }
};
