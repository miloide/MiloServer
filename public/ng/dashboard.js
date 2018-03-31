var app = angular.module('dashboard', []);
app.controller('dashboardController',[
    '$scope', '$http',
    function($scope,$http) {
        $scope.projectMenu = [
            {
                name: 'My Projects',
                icon: 'extension',
                key:'myProjects'
            },
            {
                name: 'Shared with me',
                key:'sharedProjects',
                icon: 'group',
            },
            {
                name: 'Trashed',
                key:'trashedProjects',
                icon: 'delete',
            },
        ];
        // Sort Key while displaying
        $scope.sortType = 'projectName';
        // Default search filter
        $scope.searchFilter = '';
        $scope.getProjects = function (){
            $http({
                url: '/users/projects/list',
                method: 'POST',
            })
            .then(function (res) {
                    $scope.user = res.data.user;
                    $scope.myProjects = [];
                    $scope.sharedProjects = [];
                    $scope.trashedProjects = [];
                    res.data.projects.forEach(function(item,index){
                        item = ngProject(item);
                        if (item.trashed == true && item.canModify){
                            $scope.trashedProjects.push(item);
                        } else if (!item.trashed && !item.shared){
                            $scope.myProjects.push(item);
                        } else if (!item.trashed && item.shared){
                            $scope.sharedProjects.push(item);
                        }
                    });
                    $scope.currentProjects = $scope.myProjects;
                    $scope.currentProjectsType = $scope.projectMenu[0].key;
                    $scope.currentHeading = $scope.projectMenu[0].name;
                },
                function(e){
                    console.warn(e);
            });
        };
        $scope.getProjects();

        /**
         * Adds metadata about the project that is needed by ng- attributes in the view.
         * @param {project} item
         */
        function ngProject(item){
            item.shared = false;
            item.canModify = false;
            var emailEscaped = $scope.user.email.replace(/\./g,'[dot]');
            var collabAccess =  item.collaborators? item.collaborators[emailEscaped] || 'none' : 'none';
            if (collabAccess == 'admin'|| item.owner == $scope.user.email){
                item.canModify = true;
            }
            if (item.owner != $scope.user.email){
                item.shared = true;
            }
            return item;
        }
        $scope.switchProject = function(index){
            $scope.currentHeading = $scope.projectMenu[index].name;
            $scope.currentProjectsType = $scope.projectMenu[index].key;
            $scope.currentProjects = $scope[$scope.currentProjectsType];
        };

        $scope.toggleEditButton = function(index){
            if ($scope[$scope.currentProjectsType][index].canModify){
                $("#projectNamePencil-"+index).toggleClass('hide-element');
            }
        };
        $scope.renameProject = function(index){
            if (!$scope[$scope.currentProjectsType][index].canModify){
                return;
            }
            $scope[$scope.currentProjectsType][index].oldName = $scope[$scope.currentProjectsType][index].projectName;
            $("#projectName-"+index).hide();
            $("#editProjectName-"+index).show();
            $("#editProjectName-"+index).find('input').focus();
            $("#editProjectName-"+index).on('keyup', function (e) {
                if (e.keyCode == 13) {
                    // enter key was pressed
                    $scope.saveProjectName(index);
                } else if (e.keyCode == 27) {
                    // Escape key was pressed
                    $scope[$scope.currentProjectsType][index].projectName = $scope[$scope.currentProjectsType][index].oldName;
                    $("#editProjectName-"+index).hide();
                    $("#projectName-"+index).show();
                }
            });
        };

        $scope.shareModal = function(index){
            var project = $scope[$scope.currentProjectsType][index];
            project.collabList = project.collaborators? Object.keys(project.collaborators): [];
            project.link = window.location.origin + "/editor/#" + project.projectKey;
            $scope.currentShareProject = project;
            swal({
                content: $("#shareModal")[0],
                buttons: [false,"Done"],
            });
        };

        $scope.getCollabIcon = function(key){
            var icons = {
                'admin':'work',
                'edit':'create',
                'view':'remove_red_eye'
            };
            return icons[key];
        };

        $scope.changeShareAccess = function(collaborator, accessType){
            var project = $scope.currentShareProject;
            if (!project.canModify || collaborator == project.owner){
                return;
            }
            if (accessType == 'add'){
                collaborator = collaborator.replace(/\./g,'[dot]');
            }
            var data = {
                "projectKey": project.projectKey,
                "type": "collaborator",
                'collabKey': collaborator,
                'collabAccess': accessType
            };
            $http({
                url: '/users/projects/update',
                method: 'POST',
                data: data,
            })
            .then(function (res) {
                    if (res.data.status == 200){
                        // update the current project and move it to the trashed list
                        console.log("res",res.data);
                        project.collaborators = res.data.project.collaborators;
                        project.collabList = project.collaborators? Object.keys(project.collaborators): [];
                        $scope.currentShareProject = project;
                    } else {
                        flashModalMessage(res.data.message);
                    }
                },
                function(e){
                    console.warn(e);
            });
        };

        $scope.changeVisibility = function(value){
            var project = $scope.currentShareProject;
            if (!project.canModify){
                return;
            }
            var data = {
                "projectKey": project.projectKey,
                "type": "public",
                "public": value
            };
            $http({
                url: '/users/projects/update',
                method: 'POST',
                data: data,
            })
            .then(function (res) {
                    if (res.data.status == 200){
                        // update the current project and move it to the trashed list
                        project.public = res.data.project.public;
                        $scope.currentShareProject = project;
                    } else {
                        flashModalMessage(res.data.message);
                    }
                },
                function(e){
                    console.warn(e);
            });

        };


        $scope.trashProject = function(index){
            var project = $scope[$scope.currentProjectsType][index];
            if (!project.canModify){
                return;
            }
            var data = {
                "projectKey": project.projectKey,
                "type": "trash",
                "trashed": true
            };
            $http({
                url: '/users/projects/update',
                method: 'POST',
                data: data,
            })
            .then(function (res) {
                    if (res.data.status == 200){
                        // update the current project and move it to the trashed list
                        project.trashed = true;
                        $scope[$scope.currentProjectsType].splice(index,1);
                        $scope.trashedProjects.push(project);
                    } else {
                        swal('Error',res.data.message,"error");
                    }
                },
                function(e){
                    console.warn(e);
            });
        };

        $scope.restoreProject = function(index){
            var project = $scope.trashedProjects[index];
            console.log("restore:",project);
            if (!project.canModify){
                return;
            }
            var data = {
                "projectKey": project.projectKey,
                "type": "trash",
                "trashed": false
            };
            $http({
                url: '/users/projects/update',
                method: 'POST',
                data: data,
            })
            .then(function (res) {
                    if (res.data.status == 200){
                        // update the current project and move it to it's respective list
                        project.trashed = false;
                        $scope.trashedProjects.splice(index,1);
                        if (project.shared) {
                            $scope.sharedProjects.push(project);
                        } else {
                            $scope.myProjects.push(project);
                        }

                    } else {
                        swal('Error',res.data.message,"error");
                    }
                },
                function(e){
                    console.warn(e);
            });
        };

        $scope.removeProject = function(index){
            var project = $scope.trashedProjects[index];
            console.log(project);
            if (!project.canModify){
                return;
            }

            if (!confirm("Are you sure? You can't recover this project later!")){
                // The user pressed cancel
                return;
            }
            // On confirmation
            var data = {
                "projectKey": project.projectKey,
                "type": "delete",
            };
            $http({
                url: '/users/projects/update',
                method: 'POST',
                data: data,
            })
            .then(function (res) {
                    if (res.data.status == 200){
                        // update the current project and move it to the trashed list
                        $scope.trashedProjects.splice(index,1);
                    } else {
                        alert("Failed to delete your project:",res.data.message);
                    }
                },
                function(e){
                    console.warn(e);
            });
        };

        $scope.saveProjectName = function(index){
            var project = $scope[$scope.currentProjectsType][index];
            var nameTest = new RegExp("^[A-Za-z][A-Za-z0-9_ ]+$");
            $("#projectName-"+index).show();
            $("#editProjectName-"+index).hide();
            if (!project.canModify){
                $scope[$scope.currentProjectsType][index].projectName = $scope[$scope.currentProjectsType][index].oldName;
                return;
            }
            if (!nameTest.test(project.projectName)){
                swal("Invalid project name","Project names must start with a letter, and \ncan only contain A-z,0-9,_ and space","warning");
                $scope[$scope.currentProjectsType][index].projectName = $scope[$scope.currentProjectsType][index].oldName;
                return;
            }

            var data = {
                "projectKey": project.projectKey,
                "type": "rename",
                "newName": project.projectName
            };
            $http({
                url: '/users/projects/update',
                method: 'POST',
                data: data,
            })
            .then(function (res) {
                    if (res.data.status == 200){
                        $scope[$scope.currentProjectsType][index].projectName = res.data.project.projectName;
                        $scope[$scope.currentProjectsType][index].oldName = res.data.project.projectName;
                    } else {
                        swal('Error',res.data.message,"error");
                    }
                },
                function(e){
                    console.warn(e);
            });
        };

        function flashModalMessage(message){
            $("#addCollabFlash").html(message);
            setTimeout(function(){
                $("#addCollabFlash").html("");
            },2000);
        }
}]);

// TODO(arjun): Remove after debugging
function getScope(){
    return angular.element($("#dashboardDiv")).scope();
};
