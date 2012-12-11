if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

angular.module('sig', ['sig.services', 'sig.directives', 'ui']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/:userId/tarea', {templateUrl: './ng-views/listado.html', controller: ListaTareaCtrl}).
	when('/:userId/edit', {templateUrl: './ng-views/form.html', controller: FormTareaCtrl}).
	when('/:userId/tarea/:tareaId', {templateUrl: './ng-views/detalle.html', controller: DetalleTareaCtrl}).
	otherwise({redirectTo: function(params, path, search){
		return (path + "tarea");
	}});
}]);

