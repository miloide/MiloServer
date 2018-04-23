var app = angular.module('SidebarApp', ['ngResource']);

app.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    };
}]);

app.controller('SidebarController',[
    '$scope','$rootScope','$http',
    function($scope,$rootScope,$http) {
        $rootScope.pages = ["<h4>You need to login to see this section</h4>"];
        $rootScope.markdownPages = ["#### You need to login to see this section"];
        $rootScope.selectedPage = 0;
        $rootScope.isEditing = false;
        $rootScope.canModify = false;
        $rootScope.MiloStorage = {};
        $rootScope.MiloStorage.save = function(){};

        // Initialize Markdown Editor
       function initEditor(){
            MathJax.Hub.Config({
                tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
            });

            $rootScope.editor = new SimpleMDE({
                element: $("#sidebarEditor")[0],
                promptURLs: true,
                autofocus: true,
	            forceSync: true,
                placeholder: "Type here...",
                initalValue: "Type here...",
                showIcons: ["code", "table"],
                status: ["lines", "words", "cursor"],
                spellChecker: false,
                previewRender: function(plainText) {
                    var preview = document.getElementsByClassName("editor-preview-side")[0];
                    preview.innerHTML = this.parent.markdown(plainText);
                    preview.setAttribute('id','editor-preview');
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"editor-preview"]);
                    return preview.innerHTML;
                },
            });
        };
        initEditor();
        // CRUD Operations on pages

        // Add Handler
        $rootScope.addPage = function(){
            $rootScope.pages.push("<h1> Add your content here </h1>");
            $rootScope.markdownPages.push("# Add your content here");
            $rootScope.selectedPage = $rootScope.pages.length - 1;
            var value = $rootScope.markdownPages[$rootScope.selectedPage];
            $rootScope.isEditing = true;
            $("#sidebarEditor").val(value);
            $rootScope.editor.value(value);
            setTimeout(function(){
                $rootScope.editor.codemirror.refresh();
            },100);
        };

        // Remove page Handler
        $rootScope.removePage = function(){
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this page!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    $rootScope.pages.splice($rootScope.selectedPage,1);
                    $rootScope.markdownPages.splice($rootScope.selectedPage,1);
                    $rootScope.MiloStorage.save();
                    $rootScope.$digest();
                }
              });
        };


        // Save and Edit Handler
        $rootScope.toggleEditor = function(){
            if (!$rootScope.isEditing){
                // Initialize the editor content
                var value = $rootScope.markdownPages[$rootScope.selectedPage];
                $("#sidebarEditor").val(value);
                $rootScope.editor.value(value);
                setTimeout(function(){
                    $rootScope.editor.codemirror.refresh();
                },100);
            } else {
                // Write back html from markdown
                $rootScope.pages[$rootScope.selectedPage] = $rootScope.editor.markdown(
                                                                $rootScope.editor.value()
                                                            );
                $rootScope.markdownPages[$rootScope.selectedPage] = $rootScope.editor.value();
                var divId = 'sidebar_content_' + ($rootScope.selectedPage+1);
                $rootScope.MiloStorage.save();
                setTimeout(function(){
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,divId]);
                },100);
            }
            $rootScope.isEditing = !$rootScope.isEditing;
        };



        // Navigation Link Events
        $rootScope.prevPage = function(){
            $rootScope.selectedPage  =  $rootScope.selectedPage-1 >= 0 ?
                                        $rootScope.selectedPage-1 : $rootScope.selectedPage;
        };

        $rootScope.nextPage = function(){
            $rootScope.selectedPage  =  $rootScope.selectedPage+1 < $rootScope.pages.length ?
                                        $rootScope.selectedPage+1 : $rootScope.selectedPage;

        };

        $rootScope.selectPage = function(page){
            $rootScope.selectedPage = page>=0 && page<$rootScope.pages.length ?
                                      page : $rootScope.selectedPage;
            var divId = 'sidebar_content_' + ($rootScope.selectedPage+1);
            setTimeout(function(){
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,divId]);
            },100);
        };
        $("#pinHolder").html('lock');
}]);

function getScope(){
    return angular.element($("#sidebar")).scope();
};

module.exports = {
    app,
    getScope
};
