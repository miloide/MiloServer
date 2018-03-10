// // This file contains custom blocks and other customizations for Milo

// Blockly.Blocks['dl_train'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("Train");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(230);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };
//   Blockly.Blocks['dl_feedentry'] = {
//     init: function() {
//       this.appendDummyInput()
//           .appendField("");
//       this.appendValueInput("inuptX")
//           .setCheck(null)
//           .appendField("Set inputX to");
//       this.appendValueInput("inputY")
//           .setCheck(null)
//           .appendField("Set inputY to");
//       this.appendDummyInput()
//           .appendField("costFunction")
//           .appendField(new Blockly.FieldDropdown([["Mean","MEAN"], ["Sum","SUM"], ["None","NONE"]]), "costFunction");
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//       this.setColour(230);
//    this.setTooltip("");
//    this.setHelpUrl("");
//     }
//   };
//   Blockly.Blocks['dl_optimizer'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("Set Optimizer to")
//         .appendField(new Blockly.FieldDropdown([["SGD","SGDOptimizer"], ["Adagrad","Adagrad"], ["Adamax","Adamax"], ["Adam","Adam"]]), "optimizer");
//     this.setInputsInline(true);
//     this.setNextStatement(true, null);
//     Blockly.BlockSvg.START_HAT = true;
// 	this.setPreviousStatement(true, null);
//     this.setColour(Blockly.Msg.ML_HUE);
//     this.setTooltip("Choose an optimizer");
//     this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['dl_createoptimizer'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("Set Optimizer to ")
//         .appendField(new Blockly.FieldDropdown([["Adagrad","Adagrad"], ["SGD","SGDOptimizer"], ["Adam","Adam"]]), "optimizer");
//     this.appendDummyInput()
//         .appendField("with learning rate")
//         .appendField(new Blockly.FieldNumber(0), "rate");
//     this.appendDummyInput()
//         .appendField("number of batches ")
//         .appendField(new Blockly.FieldNumber(0), "numBatches");
//     this.appendDummyInput()
//         .appendField("batch size")
//         .appendField(new Blockly.FieldNumber(0), "batchSize");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(Blockly.Msg.ML_HUE);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['dl_mlparams'] = {
//     init: function() {
//         this.appendValueInput("VALUE")
//             .setCheck("Number")
//             .appendField("Set parameter")
//             .appendField(new Blockly.FieldDropdown([["Learning Rate","learningRate"], ["Batch size","batchSize"], ["Number of batches","numBatches"]]), "paramters")
//             .appendField("to");
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(Blockly.Msg.ML_HUE);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     }
// };


// Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
//     // Block for numeric value.
//     {
//       "type": "dl_number",
//       "message0": "%1",
//       "args0": [{
//         "type": "field_number",
//         "name": "NUM",
//         "value": 0
//       }],
//       "output": "DLnumber",
//       "colour": "%{BKY_ML_HUE}",
//       "helpUrl": "https://deeplearnjs.org/docs/api/classes/scalar.html",
//       "tooltip": "A Deeplearn.js scalar",
//       "extensions": ["parent_tooltip_when_inline"]
//     },
//     {
//       "type": "dl_array1d",
//       "message0": "Vector from %1",
//       "args0": [{
//         "type": "input_value",
//         "name": "NUM",
//         "check": "Array"
//       }],
//       "inputsInline": true,
//       "output": "DLnumber",
//       "colour": "%{BKY_ML_HUE}",
//       "helpUrl": "https://deeplearnjs.org/docs/api/classes/array1d.html",
//       "tooltip": "A Deeplearn.js Array1D",
//       "extensions": ["parent_tooltip_when_inline"]
//     },
//     {
//       "type": "dl_predict",
//       "message0": "Predict label for %1",
//       "args0": [{
//         "type": "input_value",
//         "name": "NUM",
//         "check": "Array"
//       }],
//       "inputsInline": true,
//       "output": "DLnumber",
//       "colour": "%{BKY_ML_HUE}",
//       "helpUrl": "https://deeplearnjs.org/docs/api/classes/array1d.html",
//       "tooltip": "A Deeplearn.js Array1D",
//       "extensions": ["parent_tooltip_when_inline"]
//     },
//     {
//         "type": "dl_get_scalar",
//         "message0": "Get Value %1",
//         "args0": [{
//           "type": "input_value",
//           "name": "NUM",
//           "check": "DLnumber"
//         }],
//         "output": "Number",
//         "colour": "%{BKY_HISTOGRAM_HUE}",
//         "helpUrl": "https://deeplearnjs.org/docs/api/classes/ndarray.html#get",
//         "tooltip": "Get raw value ",
//         "extensions": ["parent_tooltip_when_inline"]
//       },

//     // Block for basic arithmetic operator.
//     {
//       "type": "dl_arithmetic",
//       "message0": "A %1 %2 %3 B %4",
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "A",
//           "check": "DLnumber",
//           "align": "RIGHT"
//         },
//         {
//           "type": "field_dropdown",
//           "name": "OP",
//           "options": [
//             [
//               "+",
//               "ADD"
//             ],
//             [
//               "-",
//               "MINUS"
//             ],
//             [
//               "×",
//               "MULTIPLY"
//             ],
//             [
//               "÷",
//               "DIVIDE"
//             ]
//           ]
//         },
//         {
//           "type": "input_dummy"
//         },
//         {
//           "type": "input_value",
//           "name": "B",
//           "check": "DLnumber",
//           "align": "RIGHT"
//         }
//       ],
//       "inputsInline": false,
//       "output": "DLnumber",
//       "colour": "%{BKY_ML_HUE}",
//       "helpUrl": "https://deeplearnjs.org/docs/api/classes/ndarraymath.html",
//       "extensions": ["math_op_tooltip"]
//     },

// ]);

// Blockly.Blocks['dl_dataconfiguration'] = {
//   init: function() {
//     this.appendValueInput("noAttributes")
//         .setCheck("Number")
//         .appendField("Number of Attributes");
//     this.appendValueInput("labelShape")
//         .setCheck("Number")
//         .appendField("Label Shape ");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(230);
//  this.setTooltip("");
//  this.setHelpUrl("");
// }};

// Blockly.Blocks['dl_constant'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField("")
//             .appendField(new Blockly.FieldNumber(0), "NUM");
//         this.setColour(Blockly.Msg.ML_HUE);
//         this.setOutput(true, null);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     }
// };


// Blockly.Blocks['function_plot'] = {
//   init: function() {
//     this.appendValueInput("NAME")
//         .setCheck(null)
//         .appendField("Y =");
//     this.setColour(230);
//     this.setPreviousStatement(true);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['function_plot_x'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("x");
//     this.setOutput(true, null);
//     this.setColour(230);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };

// Blockly.Blocks['stats_construct_pmf'] = {
//   init: function() {
//     this.appendValueInput("NAME")
//         .setCheck(null)
//         .appendField("Make")
//         .appendField(new Blockly.FieldDropdown([[" Hist Map From List","makeHistFromList"], [" Pmf Map From List","makePmfFromList"],[" Pmf Map from Frequencies","makePmfFromHist"]]), "NAME");
//     this.setOutput(true, null);
//     this.setColour(230);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };
// Blockly.Blocks['stats_pmf_getters'] = {
//   init: function() {
//     this.appendValueInput("NAME")
//         .setCheck(null)
//         .appendField("Get")
//         .appendField(new Blockly.FieldDropdown([["Values","items"], ["Keys","values"], ["list","getList"], ["dictionary","getDict"]]), "NAME")
//         .appendField("From Map");
//     this.setOutput(true,null);
//     this.setColour(230);
//  this.setTooltip("");
//  this.setHelpUrl("");
// }
// };

// Blockly.Blocks['stats_pmf_operations'] = {
//       init: function() {
//         this.appendValueInput("NAME")
//             .setCheck(null)
//             .appendField("Get")
//             .appendField(new Blockly.FieldDropdown([["mean","mean"], ["variance","variance"], ["exponentiation","exp"], ["normalize","normalize"]]), "NAME")
//             .appendField("From Pmf");
//         this.setOutput(true,null);
//         this.setColour(230);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   }
// };