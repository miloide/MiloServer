/**
 * Create a NameSpace for Datasets
 */
var Datasets = {};
/**
 * Converts from
 * @param {object} data = {
 *    fields: ["id","class","items"],
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
    var dataLength = data.length;
    var rowCount = 0;
    if(Datasets.iris.header)
    {
        var dataDictionary = {};
        var headers = data[0];
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
        var row = data[i];
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
        {``
            var attributeValue = dataDictionary[key][i];
            row.push(attributeValue);
        }
        rows.push(row);
    }
    return rows;
}

