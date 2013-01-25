var directives = angular.module('sig.directives', []);

directives.directive("tooltip", function () {
    return function (scope, element, attrs) {
		scope.$watch("tareas", function(){
			element.tooltip({"delay": {"show": 500, "hide": 0}});
		})
	}
});

directives.directive("pager", function() {
    return {
    	replace: true,
    	transclude: true,
    	scope: {collection: '=collection'},
		templateUrl: 'js/templates/pager.html',
		restrict: 'E'
	}
});

directives.directive("taskbuttons", function() {
	return {
		scope: {item: '=item', click:'&click'},
		restrict: 'A',
		templateUrl: 'js/templates/task-buttons.html',
		
	}
});




