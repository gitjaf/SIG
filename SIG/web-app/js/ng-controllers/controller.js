function ListaTareaCtrl($scope, Tarea) {
	
//	$http.get('http://localhost:8080/SIG/tarea').success(function(data){
//		$scope.tareas = data;
//	});
	
	$scope.tareas = Tarea.query();
	
	$scope.orderProp = 'fechaInicio';
}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
//	$http.get('http://localhost:8080/SIG/' +  $routeParams.controller + '/' + $routeParams.tareaId).
//		success(function(data){
//			$scope.tarea = data;
//		});
//	
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}


