if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

angular.module('sig', ['sigServices']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/tareas', {templateUrl: './ng-views/listado.html', controller: ListaTareaCtrl}).
	when('/:controller/:action/:tareaId', {templateUrl: './ng-views/detalle.html', controller: DetalleTareaCtrl}).
	otherwise({redirectTo: function(params, path, search){
		console.log("params: ", params);
		console.log("path: ", path);
		console.log("search: ", search);

		console.log(("/tareas?page="+search.page+"&itemsPerPage="+search.itemsPerPage));
		return ("/tareas?page="+search.page+"&itemsPerPage="+search.itemsPerPage);
	}});
}]);