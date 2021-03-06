var swal = require("sweetalert");
var $ = require('jquery');
var Helpers = require('./helpers');
/**
 * Create a NameSpace for Datasets
 */
var Datasets = {};
Datasets.convert = {};
Datasets.imported = {};

/**
 * Tracks built-in datasets that have been imported
 */
Datasets.loaded = {
    "iris": false,
    "boston": false,
    "cancer": false,
    "wine": false,
    "california": false,
    "californiaLarge": false
};


/**
 * Construct the blocks required by the flyout for the colours category.
 * @param {!Blockly.Workspace} workspace The workspace this flyout is for.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Datasets.flyoutCallback = function(workspace) {
    // Returns dataset blocks
    var xmlList = [];
    var datasetList = Object.keys(Datasets.loaded);
    var labelText = '<xml><label text="Import datasets from the Menu"></label></xml>';
    var label = Blockly.Xml.textToDom(labelText).firstChild;
    xmlList.push(label);
    for (var index in datasetList){
        var name = datasetList[index];
        if (Datasets.loaded[name] == true && Datasets.imported[name]!=undefined) {
            if (Blockly.JavaScript[name+"_get"] == undefined){
                Datasets.generateBlock(name);
            }
            var blockText = '<xml>' +
                '<block type="'+name+'_get">' +
                '</block>' +
                '</xml>';
            var block = Blockly.Xml.textToDom(blockText).firstChild;
            xmlList.push(block);
        }
    }
    return xmlList;
};

/**
 * Defines dataset blocks dynamically
 * @param name - name of loaded dataset
 */
Datasets.generateBlock = function(name){
        var keys = Object.keys(Datasets.imported[name]);
        Datasets.imported[name]["options"] = [];
        for (var index in keys){
            var option = keys[index];
            var optionname = keys[index];
            Datasets.imported[name]["options"].push([option,optionname]);
        }
        Datasets.generateBlockDefinition(name);
        Blockly.JavaScript[name+"_get"] = Datasets.codegenTemplate(name);

};
Datasets.generateBlockDefinition = function(name){
    if (Datasets.imported[name]!=undefined){
        Blockly.defineBlocksWithJsonArray([{
            "type": name+"_get",
            "message0": "get %1 from " + name,
            "args0": [
                {
                "type": "field_dropdown",
                "name": "index",
                "options": Datasets.imported[name].options,
                }
            ],
            "output": "Array",
            "colour": Blockly.Msg.HISTOGRAM_HUE,
            "tooltip": "Get chosen attribute from " + name + "dataset",
            "helpUrl": ""
        }]);
    }
};
/**
 * Triggers a click for input element fileLoader
 */

Datasets.triggerClick = function(){
    $("#fileLoader").click();
};

/**
 * Reads csv file selected by user
 * @param event - File Input event
 */

Datasets.uploadDataset= function(event){
    var file = event.target.files[0];
    if (file.type == "text/csv" || file.type == "application/vnd.ms-excel"){
        // $("#confirmModalTrigger").click();
        Datasets.readUploadedFile(file);
    } else {
        Helpers.showAlert("Error","Only csv files supported","error");
    }
};

/**
 * Custom confirm Template
 * @param fileName - name of uploaded file
 */
Datasets.readUploadedFile = function(file){
    var fileName = file.name;
    var reader = new FileReader();
    if (Datasets.fileName == undefined){
        Datasets[fileName] = {};
        Datasets[fileName].header = false;
        Datasets[fileName].rows = [];
    } else {
        Helpers.showAlert("File Error", " A File already exists with the name. This will update the contents of the previously loaded file!","error");
    }
    reader.onprogress = function(){
        $('#loadingDiv').show();
    };
    reader.onloadend = function(){
        $('#loadingDiv').hide();
    };
    reader.onerror = function(){
        Helpers.showAlert("Error", " Error encountered while reading file. Please try again!","error");
    };
    reader.onabort = function(){
        Helpers.showAlert("Error", "File reading aborted","error");
    };
    reader.onload = function(){

        var data = String(reader.result).split("\n");
        var nrows = data.length;
        var noAttributes;
        if (data[0]!=undefined){
            noAttributes = data[0].split(",").length;
        }
        for (var i = 0 ;i < nrows-1; i++) {
            var rowElements = data[i].split(",");
            var rowToString = [];
            for (var j = 0; j < noAttributes; j++){
                rowToString.push(String(rowElements[j]));
            }
            Datasets[fileName].rows.push(rowToString);
        }
        Datasets.loaded[fileName] = true;
        $("#dataset_list").append(
            '<button type="button" class="list-group-item"\
                style="cursor:pointer;"\
                onclick="Datasets.show(\''+fileName+'\')">'+
                    '<span class="badge">' + Datasets[fileName].rows.length + '</span>'+
                    fileName +
            '</button>'
        );
        // console.log(Datasets[fileName]);
        Datasets.checkHeader(fileName);
        Helpers.snackbar("Uploaded " + fileName);
    };

    swal("Is the first row a header row?","If not default column headers will be used.","info",{
        buttons: ["no","yes"],
    }).then(function(val) {
        if (val){
            Datasets[fileName].header = true;
        }
        reader.readAsText(file);
    });


};

/**
 *
 * @param {*} name - Dataset
 * Checks whether the uploaded file has its first row as header or not.
 * If not it arbitarily assigns headers to it.
 * Headers are immutable
 */
Datasets.checkHeader = function(name){
    if (Datasets[name].rows[0]==undefined){
        Helpers.showAlert("File Error"," Nothing to read! Please try again!");
        return;
    }
    if (Datasets[name].header){
        Datasets[name].headers = Datasets[name].rows[0];
        Datasets[name].rows.shift();
    } else if (!Datasets[name].header){
        var rowLength = Datasets[name].rows[0].length;
        Datasets[name].headers = [];
        for (var i = 0;i < rowLength; i++){
            Datasets[name].headers.push(String.fromCharCode(i+65));
        }
    }
    Datasets.imported[name] = Datasets.convert.rowsToMap(Datasets[name]);
    Datasets[name].header = true;
};
/**
 * Generates code generator dynamically for dataset blocks
 * @param
 */
Datasets.codegenTemplate = function (name) {
    return function (block) {
        var dropdown_index = block.getFieldValue('index');
        // TODO: Assemble JavaScript into code variable.
        var code = 'Datasets.imported["' + name + '"]["'+dropdown_index+'"]';
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
    };
};


Datasets.importHelper = function(name){
    if (name == undefined) return null;
    return new Promise((resolve, reject) => {

        if (Datasets.loaded[name]== undefined || Datasets.loaded[name]) return;
        var scriptElement = document.createElement("script");
        scriptElement.setAttribute("id",name + "_dataset");
        scriptElement.src = "/datasets/" + name + ".js";
        scriptElement.onload = function () {
            for (var i in Datasets[name].rows){
                var row = Datasets[name].rows[i];
                for (var j in row){
                    var instanceType = isNaN(row[j])? (isNaN(Date.parse(row[j])) ? "String" : "Date") : "Number";
                    if (instanceType == "Number"){
                        row[j] = parseFloat(row[j]);
                    }
                }
                Datasets[name].rows[i] = row;
            }
            Datasets.loaded[name] = true;
            Datasets.imported[name] = Datasets.convert.rowsToMap(Datasets[name]);
            $("#dataset_list").append(
                '<button type="button" class="list-group-item" onclick="Datasets.show(\''+name+'\')"\
                    style="cursor:pointer; text-transform: capitalize;">'+
                    '<span class="badge">' + Datasets[name].rows.length + '</span>'+
                    name +
                '</button>'
            );
            $("#"+name+"MenuItem").hide();
            $("#menuDatasetImport").append('<li class="divider" role="separator"></li><li style="text-transform: capitalize;"><h6>&nbspImported '+ name +'</h6></li>');
            $("#"+name+"MenuItem").attr("disabled","disabled");
            Helpers.snackbar("Imported " + name + " dataset!");
            resolve(name);
        };
        document.head.appendChild(scriptElement);
    });
};


/**
 * Shows the loaded dataset on screen
 * @param {string} name
 */
Datasets.show = function(name){
    var data;
    if (Datasets.loaded[name] == undefined || Datasets.loaded[name]==false) {
        return;
    }
    var columns = [
        {id: 'num', name: '#', field: 'num',behavior: "select", cssClass: "cell-selection", width: 60,  resizable: true,  selectable: false}
    ];

    if (Datasets[name].columns != undefined){
        columns = columns.concat(Datasets[name].columns);
    } else {
        for (var i = 0; i < Datasets[name].headers.length; i++){
            columns.push({
                id: Helpers.slugify(Datasets[name].headers[i]),
                name: Datasets[name].headers[i],
                field: Helpers.slugify(Datasets[name].headers[i]),
                // width: 60,
                resizeable: true,
                selectable: false
            });
        }
        Datasets[name].columns = columns.slice(1);
    }
    if (Datasets[name].displayData == undefined){
        data = Datasets[name].displayData = Datasets.rowsToDisplay(Datasets[name].rows,Datasets[name].columns);
    } else {
        data = Datasets[name].displayData;
    }
    if (Datasets[name].meta == undefined){
        Datasets[name].meta = {};
        Datasets[name].meta['Name/File'] = Helpers.toTitleCase(name);
        Datasets[name].meta['Number of examples'] = Datasets[name].rows.length;
        Datasets[name].meta['Attributes'] = Datasets[name].columns.length;
        var row = Datasets[name].rows[0];
        for (var i in row){
            var key = Datasets[name].columns[i].name;
            var value = isNaN(row[i])? (isNaN(Date.parse(row[i])) ? "String" : "Date") : "Number";
            Datasets[name].meta["Type of Attribute " + key] = value;
        }
    }
    $("#datasetMetaBody").html('');
    for (var key in Datasets[name].meta){
        $("#datasetMetaBody").append(
            '<tr>' +
                '<td>' + key + '</td>' +
                '<td><b>' + Datasets[name].meta[key] + '</b></td>' +
            '</tr>'
        );
    }
    $("#datasetMetaBody").append(
        '<tr>' +
            '<td>Raw Values</td>' +
            '<td>\
                <button class="btn btn-outline" \
                    onclick="console.save(Datasets['+ "'" + name + "'" + '].rows,'+"'" + name  +".json'"+ ')">\
                    JSON <i class="material-icons">cloud_download</i>\
                </button>\
            </td>'+
        '</tr>'
    );
    $("#datasetMeta").show();

    var options = {
        editable: false,
        enableAddRow: false,
        enableColumnReorder: false,
        enableCellNavigation: true
    };
    if (Datasets.grid == undefined){
        Datasets.dataView = new Slick.Data.DataView();
        Datasets.grid = new Slick.Grid("#dataGrid", Datasets.dataView, columns, options);
        Datasets.pager = new Slick.Controls.Pager(Datasets.dataView, Datasets.grid, $("#dataPager"));
         // wire up model events to drive the grid
         Datasets.dataView.onRowCountChanged.subscribe(function (e, args) {
            Datasets.grid.updateRowCount();
            Datasets.grid.render();
        });
        Datasets.dataView.onRowsChanged.subscribe(function (e, args) {
            Datasets.grid.invalidateRows(args.rows);
            Datasets.grid.render();
        });
        Datasets.dataView.beginUpdate();
        Datasets.dataView.setItems(data);
        Datasets.dataView.endUpdate();
    } else {
        Datasets.grid.setColumns(columns);
        Datasets.dataView.beginUpdate();
        Datasets.dataView.setItems(data);
        Datasets.dataView.endUpdate();
        Datasets.grid.invalidate();
        Datasets.grid.render();
    }
};



/**
 * Converts from
 * @param {object} data = [
 *           [3, 'A', 'Cheese', 1, '2017-01-12'],
 *           [1, 'B', 'Apples', 1, '2017-01-12'],
 *    ]
 * @param {Array} columns = [
 *  {id: 'num', name: '#', field: 'num', width: 40,  resizable: true,  selectable: false},
 *   ...
 * ]
 * To format needed by SlickGrid
 * @returns {object} = [
 *      {num: 3, name: 'A', item: 'Cheese', qty: 1, soldOn: '2017-01-12'}
 *  ]
*/
Datasets.rowsToDisplay = function(data,columns){
    var result = [];
    var colKeys = [];
    for (var i in columns){
        colKeys.push(columns[i].field);
    }
    for (var i in data){
        var item = {};
        item['num'] = parseInt(i)+1;
        item['id'] = "id_" + i;
        for (var j in data[i]){
            item[colKeys[j]] = data[i][j];
        }
        result.push(item);
    }
    return result;
};


/**
 * Converts from
 * @param {object} data = {
 *    header: ["id","class","items"],
 *    rows: [
 *           [3, 'A', 'Cheese', 1, '2017-01-12'],
 *           [1, 'B', 'Apples', 1, '2017-01-12'],
 *    ]
 *  }
 * To
 * @returns {object} = {
 *      id:[3,1]
 *      class:['A','B']
 *      items:['Cheese','Apples']
 *  }
*/
Datasets.convert.rowsToMap = function(data){
    var dataLength = data.rows.length;
    var dataDictionary = {};
    var headers = data.headers;
    var rowLength = headers.length;
    for (var head in headers){
        dataDictionary[headers[head]] = [];
    }
    for (var i = 0; i < dataLength; i++){
        var row = data.rows[i];
        for (var j = 0; j < row.length; j++){
            dataDictionary[headers[j]].push(row[j]);
        }
    }
    return dataDictionary;
};
/**
 * @param {object} dataDictionary =
 *      id:[3,1]
 *      class:['A','B']
 *      items:['Cheese','Apples']
 *
 * @returns {object} data = {
 *    fields: ["id","class","items"],
 *    rows: [
 *           [3, 'A', 'Cheese', 1, '2017-01-12'],
 *           [1, 'B', 'Apples', 1, '2017-01-12'],
 *    ]
 *  }
*/

Datasets.convert.mapToRows = function(dataDictionary){
    var rows = [];
    var keys = Object.keys(dataDictionary);
    var rowLength = dataDictionary[keys[0]].length;
    for (var i = 0; i < rowLength; i++) {
        var row = [];
        for (var key in keys) {
            var attributeValue = dataDictionary[key][i];
            row.push(attributeValue);
        }
        rows.push(row);
    }
    return rows;
};

/**
 * Equivalent of python's zip function
 * @param {*} arrays
 * Converts ([1,2][a,b][x,y]..) to [[1,a,x],[2,b,y]...]
 */
Datasets.zip = function(...arrays){
    const length = Math.min(...arrays.map(arr => arr.length));
    return Array.from({length}, (value, index) => arrays.map((array => array[index])));
};

module.exports = Datasets;
