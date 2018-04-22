
'use strict';
var Helpers = require('./helpers');
var clearOutput = require('./functions.js').clearOutput;
var MSG = require('./strings');
var swal = require('sweetalert');
var utils = require('./functions');
var sandbox = require('./sandbox');
// Export globally
var $ = window.$ = require('jquery');
window.SimpleMDE = require('simplemde');
var MiloStorage = require('./storage');
var Datasets =  window.Datasets = require('./datasets');
var Blockly = window.Blockly = require('milo-blocks');
window.mnist = require('./ML/Mnist/model');
var Project = require('./project');
for (var key in utils) {
  global[key] = utils[key];
}

/**
 * Create a namespace for the application.
 */
var Milo = {};


/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Milo.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
Milo.getStringParamFromUrl = function(name, defaultValue) {
	var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
	return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};


/**
 * Load blocks saved on the cloud or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Milo.loadBlocks = function(defaultXml,override=false) {
	if (window.location.hash.length > 1) {
		// An href with #key trigers an AJAX call to retrieve saved blocks.
		MiloStorage.retrieveXml(window.location.hash.substring(1));
	} else if (override){
		var xml = Blockly.Xml.textToDom(defaultXml);
		Blockly.Xml.domToWorkspace(xml, Milo.workspace);
		if ($("#newProjInput").length!=0){
			window.history.replaceState(null, null, window.location.pathname);
			if (!MiloStorage.anonymous){
				MiloStorage.canModify = true;
			}
		}
		return;
	} else {
		// Restore saved blocks in a separate thread so that subsequent
		// initialization is not affected from a failed load.
		window.setTimeout(MiloStorage.restoreBlocks, 0);
	}
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Milo.bindClick = function(el, func) {
	if (typeof el == 'string') {
		el = document.getElementById(el);
	}
	el.addEventListener('click', func, true);
	el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Milo.importPrettify = function() {
	var script = document.createElement('script');
	script.setAttribute('src', '/js/run_prettify.js');
	document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Milo.getBBox_ = function(element) {
	var height = element.offsetHeight;
	var width = element.offsetWidth;
	var x = 0;
	var y = 0;
	do {
		x += element.offsetLeft;
		y += element.offsetTop;
		element = element.offsetParent;
	} while (element);
	return {
		height: height,
		width: width,
		x: x,
		y: y
	};
};


/**
 * List of tab names.
 * @private
 */
Milo.TABS_ = ['blocks', 'javascript', 'data', 'xml'];

Milo.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Milo.tabClick = function(clickedName) {
	// If the XML tab was open, save and render the content.
	if (document.getElementById('tab_xml').className == 'tabon') {
		var xmlTextarea = document.getElementById('content_xml_text');
		var xmlText = xmlTextarea.value;
		var xmlDom = null;
		try {
			xmlDom = Blockly.Xml.textToDom(xmlText);
		} catch (e) {
			var q =
					window.confirm(MSG['badXml'].replace('%1', e));
			if (!q) {
				// Leave the user on the XML tab.
				return;
			}
		}
		if (xmlDom) {
			Milo.workspace.clear();
			Blockly.Xml.domToWorkspace(xmlDom, Milo.workspace);
		}
	}

	if (document.getElementById('tab_blocks').className == 'tabon') {
		Milo.workspace.setVisible(false);
	}
	// Deselect all tabs and hide all panes.
	for (var i = 0; i < Milo.TABS_.length; i++) {
		var name = Milo.TABS_[i];
		document.getElementById('tab_' + name).className = 'taboff';
		$('#tab_' + name).parent().removeClass('active');
		document.getElementById('content_' + name).style.visibility = 'hidden';
	}

	// Select the active tab.
	Milo.selected = clickedName;
	document.getElementById('tab_' + clickedName).className = 'tabon';
	$('#tab_' + clickedName).parent().addClass('active');
	// Show the selected pane.
	document.getElementById('content_' + clickedName).style.visibility =
			'visible';
	Milo.renderContent();
	if (clickedName == 'blocks') {
		Milo.workspace.setVisible(true);
	}
	Blockly.svgResize(Milo.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Milo.renderContent = function() {
	var content = document.getElementById('content_' + Milo.selected);

	// Initialize the pane.
	if (content.id == 'content_xml') {
		var xmlTextarea = document.getElementById('content_xml_text');
		var xmlDom = Blockly.Xml.workspaceToDom(Milo.workspace);
		var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
		xmlTextarea.value = xmlText;
		xmlTextarea.focus();
	} else if (content.id == 'content_javascript') {
		$("#graph_output").show();
		var code = Blockly.JavaScript.workspaceToCode(Milo.workspace);
		var sourceElement = document.getElementById("source_javascript");
		sourceElement.textContent = code;
		if (typeof PR.prettyPrintOne == 'function') {
			code = sourceElement.textContent;
			code = PR.prettyPrintOne(code, 'js');
			sourceElement.innerHTML = code;
		}
	} else if (content.id == 'content_data') {
			// var defaultDatasets = Object.keys(Datasets.loaded);
			// $("#builtInDropdown").empty();
			// for (var index in defaultDatasets){
			// 	$("#builtInDropdown").append(
			// 		'<option value="' +
			// 		defaultDatasets[index] + '">' +
			// 		defaultDatasets[index] +
			// 		' Dataset </option>'
			// 	);
			// }
	}
};

/**
 * Initialize Blockly.  Called on page load.
 */
Milo.init = function() {
	MiloStorage.anonymous = anonymous;
	if (MiloStorage.anonymous){
		MiloStorage.canModify = false;
	}
	// Setup loop trap
	Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';

	// Handle Category names
	for (var messageKey in MSG) {
		if (messageKey.indexOf('cat') == 0) {
			Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
		}
	}

	// Construct the toolbox XML, replacing translated variable names.
	var toolboxText = document.getElementById('toolbox').outerHTML;
	toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
			function(m, p1, p2) {return p1 + MSG[p2];});
	var toolboxXml = Blockly.Xml.textToDom(toolboxText);

	Milo.workspace = Blockly.inject('content_workspace', {
		media: '/media/',
		toolbox: toolboxXml,
		zoom: {
			controls: true,
			wheel: false
		}
	});


	Blockly.JavaScript.addReservedWords(
		'code,jscode,setup,graph,math,session,tf,Data,WebCam,MobileNet,timeouts,checkTimeout'
	);
	// Register callbacks for buttons
	Milo.workspace.registerToolboxCategoryCallback('DATASETS',Datasets.flyoutCallback);
	// Per https://groups.google.com/d/msg/blockly/Ux9OQuyJ9XE/8PvZt73aBgAJ due to bug.
	Milo.workspace.updateToolbox(document.getElementById('toolbox'));

	var xmlText = $("#init_xml_text").text().trim();
	if (xmlText.length !=0)	{
		Milo.loadBlocks(xmlText,true);
	} else {
		Milo.loadBlocks('');
	}

	// Hook a save function onto unload.
	MiloStorage.backupOnUnload(Milo.workspace);

	Milo.tabClick(Milo.selected);
	if (!MiloStorage.anonymous){
		var saveButton = document.getElementById('saveButton');
		Milo.bindClick('renameButton',Project.rename);
		Milo.bindClick(saveButton, function() {
			MiloStorage.save(Milo.workspace);
		});
		if ($("#newProjInput").length!=0){
			MiloStorage.canModify = true;
			Helpers.sidebarInit(MiloStorage.canModify, {
				pages:["<h4>Edit or add New pages</h4>"],
				markdownPages:["#### Edit or add New pages"]
			});
		}
		$("#cloneButton").click(function(e){
			window.history.replaceState(null, null, window.location.pathname);
			var originalName = $("#projectName").html();
			$("#projectName").html("Copy of "+ originalName);
			MiloStorage.canModify = true;
			delete MiloStorage.project;
			delete MiloStorage.projectKey;
			$("#renameButton").show();
			$("#saveButton").show();
			$("#downloadProjectButton").show();
			MiloStorage.save(Milo.workspace);
			Helpers.sidebarInit(MiloStorage.canModify, {pages:[],markdownPages:[]});
		});
	}
	Milo.bindClick('trashButton',function() {
		Milo.discard();
		Milo.renderContent();
	});
	$(".runButton").click(Milo.runJS);

	for (var i = 0; i < Milo.TABS_.length; i++) {
		var name = Milo.TABS_[i];
		Milo.bindClick('tab_' + name,
				function(name_) {
					return function() {
						Milo.tabClick(name_);
					};
		}(name));
	}
	var defaultDatasets = Object.keys(Datasets.loaded);
	for (var index in defaultDatasets){
		var datasetName = defaultDatasets[index];
		var listElement = document.createElement('li');
		listElement.setAttribute('id',datasetName+ 'MenuItem');
		var anchorElement = document.createElement('a');
		anchorElement.setAttribute('id',datasetName+ 'MenuButton');
		anchorElement.setAttribute('style','cursor:pointer; text-transform: capitalize;');
		anchorElement.setAttribute('onclick',"Datasets.importHelper('" + datasetName + "');");
		anchorElement.innerHTML = 'Import '+ datasetName;
		listElement.appendChild(anchorElement);
		$("#menuDatasetImport").append(listElement);
	}
	function linkSidebarStorage(){
		var elem = angular.element($("#sidebar"));
		var injector = elem.injector();
		var $rootScope = injector.get('$rootScope');
		$rootScope.$apply(function(){
			$rootScope.MiloStorage.save = MiloStorage.save;
			$rootScope.MiloStorage = MiloStorage;
		});
	}
	linkSidebarStorage();
	// Lazy-load the syntax-highlighting.
	window.setTimeout(Milo.importPrettify, 1);
};


/**
 * Execute the user's Milo.
 * TODO(arjun): Replace with JS Interpretter from
 *              https://developers.google.com/blockly/guides/app-integration/running-javascript
 */
Milo.runJS = function() {

	clearOutput();
	$('#sidebar').removeClass('sidebar-open');
	var code = Blockly.JavaScript.workspaceToCode(Milo.workspace);
	Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
	if (!window.navigator.onLine){
		Helpers.Network.showOfflineAlert();
	}
	sandbox.run(code);
	$("#console_holder").show();
};

/**
 * Discard all blocks from the workspace and clean up any used references like webcam, etc.
 */
Milo.discard = function() {
	var count = Milo.workspace.getAllBlocks().length;
	if (count > 0){
		swal("Are you sure you want to reset?",Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count),"warning",{
			buttons: true,
			dangerMode: true
		}).then(function(val) {
			if (val){
				Milo.workspace.clear();
				if (window.location.hash) {
					window.location.hash = '';
				}
			}
		});
	}
	// Clear run results
	clearOutput();
};


window.addEventListener('load', Milo.init);

window.Milo = Milo;
module.exports = Milo;
