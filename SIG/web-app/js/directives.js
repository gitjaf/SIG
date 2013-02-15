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
		scope: {item: '=item', edit:'&edit', addsub:'&addsub', addseg:'&addseg'},
		restrict: 'A',
		templateUrl: 'js/templates/task-buttons.html'
		
	}
});

directives.directive("alert", function() {
	return {
		replace: true,
		scope: {title:'=title', message:'=message', alert: '=showon', type: '=type'},
		restrict: 'A',
		templateUrl: 'js/templates/alert.html',
		link: function(scope, element, attrs){
			scope.$watch("type", function(){
				element.removeClass('alert-error alert-success');
				element.addClass(scope.type);
				
			});

			scope.alert = false;
			
			scope.$watch("alert", function(){
				if(scope.alert){
					element.slideDown();
				} else {
					element.slideUp();
				}
			});

		}
	}
});

directives.directive("collapseLink", function(){
	return {
		transclude: true,
		scope: {obj: '@elementId'},
		template: '<a data-toggle="collapse" data-ng-href="{{obj}}" data-ng-transclude>{{text}}</a>',
		restrict: 'E',
		link: function(scope, element, attrs){
			var showing = false;
			scope.text = "Ver mas...";
			element.on('click', function(e){
				showing = !showing;
				if(showing){
					scope.text = "Ocultar";
					scope.$apply();
				} else{
					scope.text = "Ver mas...";
					scope.$apply();
				}
			});
		},

		replace: true
	}

});





