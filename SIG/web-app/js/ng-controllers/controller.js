function ListaTareaCtrl($scope, $routeParams, Tarea) {
	var page = $routeParams.page ? $routeParams.page : 0;
	var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;

	
	$scope.tareas = Tarea.query({"page": page, "itemsPerPage" : items});

	$scope.orderProp = 'fechaInicio';
}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.query({idTarea:$routeParams.tareaId});
}


