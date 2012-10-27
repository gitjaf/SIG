function ListaTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tareas = Tarea.query();
	$scope.orderProp = 'fechaInicio';
}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.query({idTarea:$routeParams.tareaId});
}


