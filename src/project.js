var Helpers = require('./helpers');
var $ = require('jquery');
var MiloStorage = require('./storage');
/**
 * Namespace for all project related operations
 */
 var Project = {};

/**
 * Handles renaming of projects
 * @param {HTMLEvent} e Click event
 */
Project.rename = function(e){
    $("#editProjectInput").val($("#projectName").html());
    $("#projectName").hide();
    $("#editProjectName").show();
    $("#editProjectInput").focus();
    $("#editProjectInput").on('keyup', function (e) {
        if (e.keyCode == 13) {
            // enter key was pressed
            handleSaveName();
        } else if (e.keyCode == 27) {
            // Escape key was pressed
            $("#editProjectName").hide();
            $("#projectName").show();
        }
    });
    $("#editProjectSaveButton").click(function(e){
        handleSaveName();
    });
};


function handleSaveName(){
    var newName = $("#editProjectInput").val();
    if (/[A-Za-z][A-Za-z0-9_ ]*/.test(newName)){
        $("#projectName").html(newName);
        MiloStorage.save();
        $("#editProjectName").hide();
        $("#projectName").show();
    } else {
        Helpers.snackbar("Project names must start with a letter<br>can only contain A-z,0-9,_ and space",undefined,2000);
    }
};

module.exports = Project;
