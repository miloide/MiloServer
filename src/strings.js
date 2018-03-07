Blockly.Msg.ML_HUE = "360";
Blockly.Msg.IMAGE_HUE = "20";
Blockly.Msg.PLOT_HUE = "230";
Blockly.Msg.SCATTER_HUE = "210";
Blockly.Msg.HISTOGRAM_HUE = "195";
Blockly.Msg.TEXTS_HUE = "220";
Blockly.Msg.LOOPS_HUE = "200";
Blockly.Msg.LOGIC_HUE = "190";
Blockly.Blocks.texts.HUE = "220"

// To change global colour brightness - set HSV Saturation and Value between 0(inclusive) and 1(exclusive);
Blockly.HSV_SATURATION = 0.89;
Blockly.HSV_VALUE = 0.95;


var MSG = {
  title: " IDE",
  blocks: "Blocks",
  linkTooltip: "Save and link to blocks.",
  runTooltip: "Run the program defined by the blocks in the workspace.",
  badCode: "Program error:\n%1",
  timeout: "Maximum execution iterations exceeded.",
  trashTooltip: "Discard all blocks.",
  catLogic: "Logic",
  catLoops: "Loops",
  catMath: "Math",
  catText: "Text",
  catLists: "Lists",
  catColour: "Colour",
  catVariables: "Variables",
  catFunctions: "Functions",
  catML: "Machine Learning",
  listVariable: "list",
  textVariable: "text",
  httpRequestError: "There was a problem with the request.",
  linkAlert: "Share your blocks with this link:\n\n%1",
  hashError: "Sorry, '%1' doesn't correspond with any saved program.",
  xmlError: "Could not load your saved file. Perhaps it was created with a different version of Blockly?",
  badXml: "Error parsing XML:\n%1\n\nSelect 'OK' to abandon your changes or 'Cancel' to further edit the XML."
};

module.exports = MSG;