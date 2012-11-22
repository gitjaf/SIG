if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

angular.module('sig', ['sigServices', 'ui']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/tarea', {templateUrl: './ng-views/listado.html', controller: ListaTareaCtrl}).
	when('/edit', {templateUrl: './ng-views/form.html', controller: FormTareaCtrl}).
	when('/tarea/:tareaId', {templateUrl: './ng-views/detalle.html', controller: DetalleTareaCtrl}).
	otherwise({redirectTo: function(params, path, search){
		return ("/tarea");
	}});
}]);