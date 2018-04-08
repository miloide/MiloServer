/**
 * @fileoverview Loading and saving blocks with localStorage and server-side DB.
 */

 'use strict';

// Create a namespace for storage related operations.
var MiloStorage = {};

var Blockly = require('milo-blocks');
var Helpers = require('./helpers');
var $ = require('jquery');

/**
 * Backup code blocks to localStorage.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
MiloStorage.backupBlocks_ = function(workspace) {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    // Gets the current URL, not including the hash.
    var url = window.location.href.split('#')[0];
    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
  }
};

/**
 * Bind the localStorage backup function to the unload event.
 * @param {Blockly.WorkspaceSvg=} optWorkspace Workspace override option.
 */
MiloStorage.backupOnUnload = function(optWorkspace) {
  var workspace = optWorkspace || Blockly.getMainWorkspace();
  window.addEventListener('unload',function(){
    MiloStorage.backupBlocks_(workspace);
  }, false);
};

/**
 * Restore code blocks from localStorage.
 * @param {Blockly.WorkspaceSvg=} optWorkspace Workspace override option.
 */
MiloStorage.restoreBlocks = function(optWorkspace) {
  var url = window.location.href.split('#')[0];
  if ('localStorage' in window && window.localStorage[url]) {
    var workspace = optWorkspace || Blockly.getMainWorkspace();
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    xml = MiloStorage.pruneUndefined(xml);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }
};

/**
 * Save project to database
 * @param {Blockly.WorkspaceSvg=} optWorkspace Workspace override option.
 */
MiloStorage.save = function(optWorkspace,showAlert=false) {
  var workspace = optWorkspace || Blockly.getMainWorkspace();
  var xml = Blockly.Xml.workspaceToDom(workspace);
  var data = Blockly.Xml.domToText(xml);
  var projectName = $("#projectName").html();
  $.post( "/storage",{
    'type': "save",
    'projectName': projectName,
    'projectKey': MiloStorage.projectKey || '',
    'xml': data
  }).done(function(response){
      if (response.status != 200){
        Helpers.showAlert("Project Save Failed!",
                  '\nError Code: '+response.status,"error"
        );
        return;
      }
      MiloStorage.projectKey = response.key;
      window.location.hash = response.key;
      if (showAlert){
        Helpers.showAlert("",
              "Your project was saved successfully!",
              "success"
        );
      }
      $('#statusBar').html('All changes saved!');
      if ($("#newProjInput").length !=0){
        $("#newProjInput").remove();
      }
      setTimeout(function(){
        $('#statusBar').html('');
      },1500);
      MiloStorage.monitorChanges_(workspace);
    });
};

/**
 * Retrieve XML text from database using given key.
 * @param {string} key Key to XML, obtained from href.
 * @param {Blockly.WorkspaceSvg=} optWorkspace Workspace override option.
 */
MiloStorage.retrieveXml = function(key, optWorkspace) {
  var workspace = optWorkspace || Blockly.getMainWorkspace();
  $.post( "/storage",{
    'type': "load",
    'projectKey': key,
  }).done(function(response){
      if (response.status != 200){
        Helpers.showAlert("Failed to load project",
                  '\nError Code: '+response.status,"error"
        );
        // clear the key from url
        window.location.hash = '';
        return;
      }
      MiloStorage.loadXml_(response.xml, workspace);
      MiloStorage.monitorChanges_(workspace);
      $("#projectName").html(response.project.projectName);
      if (!response.canRename){
        $("#renameButton").hide();
      }
      if (response.canModify){
        MiloStorage.projectKey = response.projectKey;
        MiloStorage.project = response.project;
        MiloStorage.canModify = true;
      } else {
        MiloStorage.canModify = false;
        $("#saveButton").hide();
        $("#cloneButton").show();
        $("#downloadProjectButton").hide();
      }
  });
};


/**
 * Start monitoring the workspace.  If a change is made that changes the XML,
 * clear the key from the URL.  Stop monitoring the workspace once such a
 * change is detected.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
MiloStorage.monitorChanges_ = function(workspace) {
  var startXmlDom = Blockly.Xml.workspaceToDom(workspace);
  var startXmlText = Blockly.Xml.domToText(startXmlDom);
  var bindData = workspace.addChangeListener(change);
  function change() {
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);
    var xmlText = Blockly.Xml.domToText(xmlDom);
    if (startXmlText != xmlText) {
      $('#statusBar').html('You have unsaved changes');
      workspace.removeChangeListener(bindData);
    }
  }
};

/**
 * Load blocks from XML.
 * @param {string} xml Text representation of XML.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
MiloStorage.loadXml_ = function(xml, workspace) {
  try {
    xml = Blockly.Xml.textToDom(xml);
  } catch (e) {
    MiloStorage.alert(MiloStorage.XML_ERROR + '\nXML: ' + xml);
    return;
  }
  // Clear the workspace to avoid merge.
  workspace.clear();
  xml = MiloStorage.pruneUndefined(xml);
  Blockly.Xml.domToWorkspace(xml, workspace);
};

/**
 * Present a text message to the user.
 * Designed to be overridden if an app has custom dialogs, or a butter bar.
 * @param {string} message Text to alert.
 */
MiloStorage.alert = function(message) {
  window.alert(message);
};

/**
 * Removes blocks which aren't currently defined
 * @param {XMLDomElement} xml
 */
MiloStorage.pruneUndefined = function(xml){
  var jqueryXml = $(xml);
  var toRemove = [];
  jqueryXml.find("block[type$='_get']").each(function(i,e) {
    if (Blockly.JavaScript[e.getAttribute("type")] == undefined){
      toRemove.push(e.getAttribute("type"));
    }
  });
  toRemove.forEach(function(val,i){
    jqueryXml.find("block[type='"+val+"']").remove();
  });
  return jqueryXml[0];
};

module.exports = MiloStorage;
