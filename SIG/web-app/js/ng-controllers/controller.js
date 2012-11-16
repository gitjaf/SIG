function ListaTareaCtrl($scope, $routeParams, $location, Tarea) {
	var page = $routeParams.page ? $routeParams.page : 0;
	var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	var sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	var query = $routeParams.q ? $routeParams.q : "";
	
	$scope.tareas = Tarea.query({"page": page, "itemsPerPage" : items, "sortBy": sortBy, "q": query});

	$scope.query = query;

	$scope.sort = function(field) {
		$location.search("sortBy", field);
	}

	$scope.search = function(query){
		$location.search("q", query);
		$location.search("page","0");
	}

	$scope.$on('filter', function(event, filter){
		$location.search("q", filter);
		$location.search("page", "0");
	});

	$scope.isActive = function(item) {
		return $routeParams.q === item;
	}

	

}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}


