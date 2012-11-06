function ListaTareaCtrl($scope, $routeParams, Tarea) {
	var page = $routeParams.page ? $routeParams.page : 0;
	var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	var sortBy = $routeParams.sortBy ? $routeParams.sortBy : "asunto";
	
	$scope.tareas = Tarea.query({"page": page, "itemsPerPage" : items, "sortBy": sortBy});
	$scope.orderProp = 'fechaInicio';

}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}


