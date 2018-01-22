// This file contains custom blocks and other customizations for Milo

// To change global colour brightness - set HSV Saturation and Value between 0(inclusive) and 1(exclusive);
Blockly.HSV_SATURATION = 0.60;
Blockly.HSV_VALUE = 0.75;

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