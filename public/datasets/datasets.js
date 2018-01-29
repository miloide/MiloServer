/**
 * Create a NameSpace for Datasets
 */
var Datasets = {};
Datasets.convert = {};
Datasets.imported = {};
Datasets.uploadedDataset = {};

/**
 * Tracks built-in datasets that have been imported
 */
Datasets.loaded = {
    "iris":false,
    "california_housing":false
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
    var labelText = '<xml><label text="Import datasets from the Data Explorer"></label></xml>';
    var label = Blockly.Xml.textToDom(labelText).firstChild;
    xmlList.push(label);
    for (var index in datasetList){
        var name = datasetList[index];
        if (Datasets.loaded[name] == true) {
            if (Blockly.JavaScript[name+"_get"] == undefined)
            {
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

    if(Blockly.JavaScript[name+"_get"] == undefined)
    {
        if(Datasets.imported[name]==undefined)
        {
            Datasets.imported[name] = Datasets.convert.rowsToMap(Datasets[name]);
        }
        var keys = Object.keys(Datasets.imported[name]);
        Datasets.imported[name]["options"] = [];
        for(var index in keys){
            var option = keys[index];
            var optionname = keys[index];
            Datasets.imported[name]["options"].push([option,optionname]);
        }
        Datasets.generateBlockDefinition(name);
        Blockly.JavaScript[name+"_get"] = Datasets.codegenTemplate(name);
    }
}

Datasets.generateBlockDefinition = function(name){
    if(Datasets.imported[name]!=undefined){
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
}
/**
 * Reads csv file selected by user
 * @param event - File Input event 
 */

Datasets.uploadDataset= function(event){
    var reader = new FileReader();
    var file = event.target.files[0];
    reader.onload = function(){
        if(Datasets.uploadDataset[file.name].length > 0)
            Datasets.uploadDataset[file.name] = [];
        var data = String(reader.result).split("\n");
        var nrows = data.length;
        var noAttributes;
        var colWidths = [];
        if(data[0]!=undefined){
            noAttributes = data[0].split(",").length;
            for(let i = 0; i < noAttributes; i++)
                colWidths.push(100);
        }
        for(let i = 0 ;i < nrows-1; i++)
        {
            var rowElements = data[i].split(",");
            var rowToString = [];
            for(let j = 0; j < noAttributes; j++)
                rowToString.push(String(rowElements[j]));
            Datasets.uploadDataset[file.name].push(rowToString);
        }
        console.log(Datasets.uploadDataset);
        Datasets.show(Datasets.uploadDataset);  
    }
    if(file.type == "text/csv")
    {
        reader.readAsText(file);
        Datasets.uploadDataset[file.name] = [];
    }
    else   
        alert("Only csv files supported");    
}

/**
 * Generates codegenerator dynamically for dataset blocks
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


/**
 * Imports dataset given as parameter
 * @param {string} name
 */

Datasets.importBuiltIn = function(){
    var name = $("#builtInDropdown").val();
    if (name == undefined) return;
    if (Datasets.loaded[name]== undefined || Datasets.loaded[name]) return;
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute("id",name+"_dataset");
    scriptElement.src = "datasets/"+name+".js";
    scriptElement.onload = function () {
        Datasets.loaded[name] = true;
        $("#dataset_list").append(
            '<li><button class="button-none" onclick="Datasets.show(\''+name+'\')">'+name+'</button></li>'
        );
    };
    document.head.appendChild(scriptElement);
}

/**
 * Shows the loaded dataset on screen
 * @param {string} name
 */
Datasets.show = function(name){
    if (Datasets.loaded[name]== undefined || Datasets.loaded[name]==false) return;
    var data = Datasets[name].rows;
    var colWidths = [];
    var headerRow = data[0];
    for(let i = 0; i < headerRow.length; i++)
    {
        colWidths.push(100);
    }
    $('#dataset_output').jexcel({data:data,colWidths:colWidths});
    $('#dataset_save').html('Save ' + name);
    $('#dataset_save').show();
    $('#dataset_save').on('click',function(){
        Datasets[name].rows = $("#dataset_output").jexcel('getData');
    });
}
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
    var rowCount = 0;
    var dataDictionary = {};
    if(data.header)
    {
        var headers = data.rows[0];
        rowCount++;
        for(let i = 0;i < headers.length; i++)
        {
            var key = headers[i];
            dataDictionary[key] = [];
        }
    }
    else
    {
        for(let i = 0;i < headers.length; i++)
        {
            dataDictionary[i] = [];
        }
    }
    var headers = Object.keys(dataDictionary);
    for(let i = rowCount; i < dataLength; i++)
    {
        var row = data.rows[i];
        for(let j = 0;j < row.length;j++)
        {
            dataDictionary[headers[j]].push(row[j]);
        }
    }
    return dataDictionary;
}
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
    for(let i = 0; i < rowLength; i++)
    {
        var row = [];
        for(var key in keys)
        {
            var attributeValue = dataDictionary[key][i];
            row.push(attributeValue);
        }
        rows.push(row);
    }
    return rows;
}

