// This file contains custom blocks and other customizations for Milo

Blockly.Blocks['train'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Train");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
  Blockly.Blocks['dl_feedentry'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("");
      this.appendValueInput("inuptX")
          .setCheck(null)
          .appendField("Set inputX to");
      this.appendValueInput("inputY")
          .setCheck(null)
          .appendField("Set inputY to");
      this.appendDummyInput()
          .appendField("costFunction")
          .appendField(new Blockly.FieldDropdown([["Mean","MEAN"], ["Sum","SUM"], ["None","NONE"]]), "costFunction");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
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
      "type": "predict",
      "message0": "Predict label for %1",
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
        "type": "plot_bar",
        "lastDummyAlign0": "RIGHT",
        "message0": "Bar %1 X %2 Y %3 Label %4 Color %5 %6",
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
          }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
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

Blockly.Blocks['dataconfiguration'] = {
  init: function() {
    this.appendValueInput("noAttributes")
        .setCheck("Number")
        .appendField("Number of Attributes");
    this.appendValueInput("labelShape")
        .setCheck("Number")
        .appendField("Label Shape ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
}};

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


Blockly.Blocks['lists_zip_with'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['lists_zip_with_item']));
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('lists_zip_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('ADD' + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.LISTS_ZIP_INPUT_WITH);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i);
      i++;
    }
  }
};

Blockly.Blocks['lists_zip_with_item'] = {
  /**
   * Mutator block for adding items to zip lists
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['function_plot'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("Y =");
    this.setColour(230);
    this.setPreviousStatement(true);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_plot_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("x");
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['stats_construct_pmf'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([[" Make Hist From List","makeHistFromList"], ["Make Pmf From List","makePmfFromList"],["Make Pmf from Hist","makePmfFromHist"]]), "NAME");
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Blocks['stats_pmf_getters'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("Get")
        .appendField(new Blockly.FieldDropdown([["items","items"], ["keys","values"], ["list","getList"], ["dictionary","getDict"]]), "NAME")
        .appendField("From");
    this.setPreviousStatement(true, null);
    this.setOutput(true,null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
}
};

Blockly.Blocks['stats_pmf_operations'] = {
      init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("Get")
            .appendField(new Blockly.FieldDropdown([["mean","mean"], ["variance","variance"], ["exponentiation","exp"], ["normalize","normalize"]]), "NAME")
            .appendField("From Pmf");
        this.setPreviousStatement(true, null);
        this.setOutput(true,null);
        this.setNextStatement(true, null);
        this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};