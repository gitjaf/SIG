function SeguimientoCtrl($scope, $routeParams, $location, $rootScope, $filter, Tarea, Seguimiento){
	
	$scope.saveSeguimiento = function(tarea){
		$scope.seguimiento.idTarea = tarea.id;
		$scope.seguimiento.idUsuario = $rootScope.userId;

		$scope.seguimiento.fecha = $filter('date')($scope.seguimiento.fecha, "dd/MM/yyyy");

		if($scope.seguimiento.id){
			$scope.seguimiento.$update({idTarea: $scope.seguimiento.idTarea,
			 idSeguimiento: $scope.seguimiento.id, userId: $rootScope.userId }, 
			 function(seguimiento, putResponseHeaders){
		 		var mensaje = "El seguimiento '" + seguimiento.titulo + "' fue actualizado con exito",
				titulo = "Editar Seguimiento: ",
				duracion = 4000,
				tipo = 'alert-success';

				var seguimientos = _.reject(tarea._embedded.seguimientos,
				 	function(value) {
				  		return (value.id == seguimiento.id);
					});

				seguimientos.push(seguimiento);

				seguimientos = _.sortBy(seguimientos, 
					function(value){
						return -Date.parse(value.fecha);
					}
				);

				tarea._embedded.seguimientos = seguimientos;

				$scope.alert(titulo, mensaje, tipo, duracion);	
			 }, 
			 function(response, putResponseHeaders){
		 		var mensaje = "Error al intentar editar el seguimiento '" + $scope.seguimiento.titulo + "'",
				titulo = "Crear Seguimiento: ",
				duracion = 4000,
				tipo = 'alert-error';

				$scope.alert(titulo, mensaje, tipo, duracion);	
			 }

			);
		} else {

			$scope.seguimiento.$save(
				function(seguimiento, putResponseHeaders){
					var mensaje = "El seguimiento '" + seguimiento.titulo + "' fue creado con exito",
					titulo = "Crear Seguimiento: ",
					duracion = 4000,
					tipo = 'alert-success';
					if(tarea._embedded.seguimientos){
				    	tarea._embedded.seguimientos.push(seguimiento);
					} else {
						tarea._embedded.seguimientos = [seguimiento];
					}

					tarea._embedded.seguimientos = _.sortBy(tarea._embedded.seguimientos, 
						function(value){
							return -Date.parse(value.fecha);
						}
					);

					$scope.alert(titulo, mensaje, tipo, duracion);	
			}, 
				function(response, putResponseHeaders){
					var mensaje = "Error al intentar crear el seguimiento '" + $scope.seguimiento.titulo + "'",
					titulo = "Crear Seguimiento: ",
					duracion = 4000,
					tipo = 'alert-error';

					$scope.alert(titulo, mensaje, tipo, duracion);	
			});
		}

	}

}
