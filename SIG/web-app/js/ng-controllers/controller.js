function ListaTareaCtrl($scope, $routeParams, $location, Tarea) {
	var page = $routeParams.page ? $routeParams.page : 0;
	var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	var sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	var query = $routeParams.q ? $routeParams.q : "";


	
	$scope.tareas = Tarea.query({"page": page, "itemsPerPage" : items, "sortBy": sortBy, "q": query});
	
	$scope.sort = function(field) {
		$location.search("sortBy", field);
	}
	$scope.search = function(query){
		$location.search("q", query);
		$location.search("page","0");
		console.log($location.search());
	}

}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}


