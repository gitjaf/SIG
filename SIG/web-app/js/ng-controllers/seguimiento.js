function SeguimientoCtrl($scope, $routeParams, $location, $rootScope, $filter, Tarea, Seguimiento){
	
	$scope.saveSeguimiento = function(tarea){
		$scope.seguimiento.idTarea = tarea.id;
		$scope.seguimiento.idUsuario = $rootScope.userId;

		$scope.seguimiento.$save(
			function(seg, putResponseHeaders){
				console.log(seg)
				var mensaje = "El seguimiento '" + seg.titulo + "' fue creado con exito",
				titulo = "Crear Seguimiento: ",
				duracion = 4000,
				tipo = 'alert-success';

				$scope.alert(titulo, mensaje, tipo, duracion);	
		}, 
			function(response, putResponseHeaders){
				var mensaje = "Error al intentar crear el seguimiento '" + seg.titulo + "'",
				titulo = "Crear Seguimiento: ",
				duracion = 4000,
				tipo = 'alert-error';

				$scope.alert(titulo, mensaje, tipo, duracion);	
		});


	}



}
