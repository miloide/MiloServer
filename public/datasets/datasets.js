/**
 * Create a NameSpace for Datasets
 */
var Datasets = {};
Datasets.convert = {};

/**
 * Tracks built-in datasets that have been imported
 */
Datasets.loaded = {
    "iris":false,
};


/**
 * Construct the blocks required by the flyout for the colours category.
 * @param {!Blockly.Workspace} workspace The workspace this flyout is for.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Datasets.flyoutCallback = function(workspace) {
    // Returns dataset blocks
    var xmlList = [];
    if (Blockly.Blocks['iris_get'] && Datasets.loaded.iris == true) {
        var blockText = '<xml>' +
            '<block type="iris_get">' +
            '</block>' +
            '</xml>';
        var block = Blockly.Xml.textToDom(blockText).firstChild;
        xmlList.push(block);
    }
    return xmlList;
  };


/**
 * Imports dataset given as parameter
 * @param {string} name
 */
Datasets.importBuiltIn = function(name){
    if (name == undefined) return;
    if (Datasets.loaded[name]== undefined || Datasets.loaded[name]) return;
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute("id",name+"_dataset");
    scriptElement.src = "datasets/"+name+".js";
    scriptElement.onload = function () {
        Datasets.loaded[name] = true;
        //console.log("Loaded " + name + " dataset with " + Datasets[name].rows.length +" rows.");
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
    $('#dataset_save').append(' ' + name);
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

