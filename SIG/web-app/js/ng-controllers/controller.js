function AppCtrl($rootScope, $location, $routeParams, AuthService){
	AuthService.authenticate();

}

function LoginCtrl($scope, $rootScope, $routeParams, $location, AuthService) {

	$scope.login = function(){
		var loginData = {url: "/login"}
		var loginResource =	AuthService.sdo(loginData)

		loginResource.login(
			{
			 "username": $scope.username,
			 "password": $scope.password
			},

			function(usuario, putResponseHeaders){
				AuthService.data.isLogged = true;
				AuthService.data.usuario = usuario;
				$rootScope.user = usuario;
				$rootScope.userId = usuario.id;
				$location.url(usuario._links.appRoot.href)

			},

			function(response, putResponseHeaders){
				$scope.loginError = true;
			}
		);
	}
}

function ListaTareaCtrl($scope, $routeParams, $location, $rootScope, $filter, Usuario,
 Tarea, Tipo, Seguimiento, Resource, $document, AuthService) {

	$rootScope.page = $routeParams.page ? $routeParams.page : 0;
	$rootScope.items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	$rootScope.sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	$rootScope.query = $routeParams.q ? $routeParams.q : "";
	$rootScope.filtro = $routeParams.filtro ? $routeParams.filtro : "todas";
	$rootScope.idTarea = $routeParams.idTarea ? $routeParams.idTarea : "";
	$scope.userActions = [{
		"text": "Salir",
		"click": "logout()"
	}];

	$scope.detalle = undefined;

	$scope.verDetalleTarea = function(tarea){
		$scope.detalle = tarea;

	}

	if($rootScope.detalle){
		$scope.verDetalleTarea($rootScope.detalle);
	}


	$scope.safeApply = function(fn) {
  		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
		    if(fn && (typeof(fn) === 'function')) {
		    	fn();
		    }
		}else {
		   	this.$apply(fn);
		}
	};

	$scope.logout = function(){
		var data = {url: "/logout"}
		var loginData = {url: "/login"}
		AuthService.sdo(data).logout({},
			function(response, putResponseHeaders) {
				AuthService.checkCredentials(loginData);
			},

			function(response, putResponseHeaders) {
				$location.url(loginData.url);
			}
		);

	}

	$scope.$on('refresh', function(event){
		refresh();
	});

	$scope.sort = function(field) {
		$location.search("sortBy", field);
		$rootScope.sortBy = field;
	}

	$scope.search = function(query){
		$rootScope.query = query;
		$location.search({q: $rootScope.query, page: 0});
	}

	$scope.changeFilter = function(filterName){
		var loc = "/tarea" ;
		if(filterName){
			loc +=  "/" + filterName;
		}
		$location.url(loc);

		$rootScope.filtro = filterName;
		$rootScope.navigation = undefined;
		$rootScope.query = "";
		$scope.query = "";
		$rootScope.tareaSuperior = undefined;
		$rootScope.idTarea = undefined;
		$rootScope.detalle = undefined;
	}

	$scope.$on('filter', function(event, filter){
		if(filter != ''){
			$location.search({q: filter});
		} else{
			var url = '/tarea';
			if($rootScope.idTarea){
				url = url + '/' + $rootScope.idTarea
			}
			$location.url(url);
		}
		$rootScope.raiz = true;
	});

	$scope.$on('addCrumb', function(event, args){
		$scope.addCrumb(args.tarea);
	})

	$scope.isActive = function(item) {
		if($rootScope.filtro){
			return $rootScope.filtro === item;
		}
		return undefined;
	}

	$scope.isActiveQuery =function(q){
		if($rootScope.query){
			return $rootScope.query === q;
		}
		return undefined;
	}

	$scope.addCrumb = function(tarea, subtarea){
		if(!$rootScope.navigation){
			$rootScope.navigation = [];
		}
		_($rootScope.navigation).each( function(obj, key, list) {
			if(obj.id == tarea.id){
				list.splice(key);
			}
		});

		$rootScope.raiz = undefined;
		$rootScope.navigation.push(tarea);
		$rootScope.detalle = subtarea;
		$location.url(tarea._links.self.href+"/"+$rootScope.filtro);
		$routeParams.page = 0;
		$scope.idTarea = tarea.id;
		$rootScope.tareaSuperior = tarea;

	}

	$scope.nuevaTarea = function(tarea){

		$scope.form = 'tarea';
		$scope.showTipo = false;
		$scope.showTiempo = false;
		$scope.showAsigna = false;
		$scope.showDesc = false;

		if(!tarea){
			$rootScope.idTarea = "";
			crearTarea();
		}else {
			crearTarea();
			crearSubTarea(tarea);
		}
		angular.element('#edit').on('shown', function(){
			angular.element('#form_asunto').focus();
		})
	}

	$scope.editarTarea = function(t){

		$scope.form = 'tarea';
		$scope.tarea = new Tarea();
		angular.copy(t, $scope.tarea);

		$scope.tarea.asunto = t.asunto;
		$scope.tarea.tipo = getProperty("tipo", $scope.tarea);
		$scope.showTipo = !(_.isEmpty($scope.tarea.tipo));

		$scope.tarea.fechaInicio = $filter('date')($scope.tarea.fechaInicio, "dd/MM/yyyy");
		$scope.tarea.fechaRevision = $filter('date')($scope.tarea.fechaRevision, "dd/MM/yyyy");
		$scope.tarea.fechaVencimiento = $filter('date')($scope.tarea.fechaVencimiento, "dd/MM/yyyy");
		angular.copy($scope.tarea.fechaInicio, $scope.dateInicia);
		angular.copy($scope.tarea.fechaVencimiento, $scope.dateVence);

		$scope.showTiempo = !(_.isEmpty($scope.tarea.fechaInicio) && _.isEmpty($scope.tarea.fechaVencimiento));

		$scope.tarea.idTareaSuperior = $rootScope.idTarea;
		$scope.tarea.asignados = getProperty("asignados", $scope.tarea);
		$scope.tarea.seguidores = getProperty("seguidores", $scope.tarea);
		$scope.showAsigna = !(_.isEmpty($scope.tarea.asignados) && _.isEmpty($scope.tarea.seguidores));

		$scope.showDesc = !(_.isEmpty($scope.tarea.descripcion));

		$scope.form_action = "Editar Tarea";

	}

	$scope.save = function(tarea){

		var tareas = $scope.tareas._embedded.collection;

		var idTareaSuperior = $rootScope.idTarea;

		var restaurada = tarea.restaurada;

		$scope.tarea = new Tarea();
		angular.copy(tarea, $scope.tarea);
		$scope.tarea.idTareaSuperior = idTareaSuperior;

		$scope.tarea.fechaInicio = $filter('date')(tarea.fechaInicio, "dd/MM/yyyy");
		$scope.tarea.fechaRevision = $filter('date')($scope.tarea.fechaRevision, "dd/MM/yyyy");
		$scope.tarea.fechaVencimiento = $filter('date')(tarea.fechaVencimiento, "dd/MM/yyyy");

		if($scope.tarea.id){
			Resource.getResource(
				tarea._links.update.href
			).update($scope.tarea,
				function(tarea, putResponseHeaders){
					$rootScope.idTarea = idTareaSuperior;
					refresh();
					var mensaje = "La tarea '" + tarea.asunto + "' fue editada con exito",
					titulo = "Editar Tarea: ",
					duracion = 4000,
					tipo = 'alert-success';
					$scope.alert(titulo, mensaje, tipo, duracion);
					if(tarea.borrado){
						$scope.detalle = undefined;
					} else {
						$scope.detalle = tarea;
					}

				}, function(response, putResponseHeaders){
					var mensaje = "Error al editar la tarea '" + $scope.tarea.asunto + "'",
					duracion = 4000,
					titulo = "Editar Tarea: ",
					tipo = 'alert-error';

					$scope.alert(titulo, mensaje, tipo, duracion);
			});
		} else {
			Resource.getResource($scope.tareas._links.create.href).create($scope.tarea,
				function(tarea, putResponseHeaders){
					if(_($scope.tareas._embedded.collection).isEmpty()) {
						refresh();
					} else {
						var tareaSuperior;
						if(idTareaSuperior){
							 tareaSuperior = _($scope.tareas._embedded.collection).find( function(value) {
							  return value.id == idTareaSuperior;
							});

							if(tareaSuperior._embedded.tareasRelacionadas){
								tareaSuperior._embedded.tareasRelacionadas.push(tarea);
							}else {
								tareaSuperior._embedded.tareasRelacionadas = [tarea];
							}
							$scope.$broadcast('subtareaAgregada');
						} else {
							refresh();
						}
						$scope.detalle = tareaSuperior;
					}

					var mensaje = "La tarea '" + tarea.asunto + "' fue creada con exito",
					titulo = "Crear Tarea: ",
					tipo = 'alert-success',
					duracion = 4000;

					$scope.alert(titulo, mensaje, tipo, duracion);

				},function(response, putResponseHeaders){
					var mensaje = "Error al crear la tarea '" + $scope.tarea.asunto + "'",
					titulo = "Crear Tarea: ",
					tipo = 'alert-error',
					duracion = 4000;

					$scope.alert(titulo, mensaje, tipo, duracion);
			});
		}
	}

	$scope.borradoLogico = function(tarea){
		tarea.borrado = true;
		$scope.save(tarea);
		$scope.ocultarDetalle();
	}

	$scope.borrar = function(tarea){
		var tareas = $scope.tareas._embedded.collection;

		Resource.getResource(tarea._links.delete.href).delete(

			function(response, putResponseHeaders){
				removeObject(tareas, tarea, "id");
				$scope.tareas.data.total = $scope.tareas.data.total - 1;
				$scope.detalle = undefined;
				var mensaje = "La tarea '" + tarea.asunto + "' fue eliminada con exito del sistema",
				titulo = "Eliminar Tarea Permanentemente: ",
				duracion = 4000,
				tipo = 'alert-success';
				$scope.alert(titulo, mensaje, tipo, duracion);

			}, function(response, putResponseHeaders){
				var mensaje = "Error al intentar eliminar la tarea '" + $scope.tarea.asunto + "'",
				duracion = 4000,
				titulo = "Eliminar Tarea Permanentemente: ",
				tipo = 'alert-error';

				$scope.alert(titulo, mensaje, tipo, duracion);
			});
	}

	$scope.vaciarPapelera = function(){

		$scope.tareas.$deleteAll({userId: $rootScope.userId},
			function(response, putResponseHeaders){
				var mensaje = "La papelera se vacio con exito",
				titulo = "Vaciar Papelera: ",
				duracion = 4000,
				tipo = 'alert-success';
				$scope.detalle = undefined;
				refresh();
				$scope.alert(titulo, mensaje, tipo, duracion);

			},
			function(response, putResponseHeaders){
				var mensaje = "Error al intentar vaciar la papelera",
				duracion = 4000,
				titulo = "Vaciar Papelera: ",
				tipo = 'alert-error';

				$scope.alert(titulo, mensaje, tipo, duracion);
			});

	}

	$scope.restaurar = function(tarea){
		tarea.borrado = false;
		tarea.restaurada = true;
		$scope.save(tarea);
		$scope.ocultarDetalle();
	}




	$scope.ocultarDetalle = function(){
		$scope.detalle = undefined;
	}

	$scope.editarSeguimiento = function(tarea, seguimiento){
		$scope.form = 'seguimiento';
		$scope.form_action = "Seguimiento de " + tarea.asunto;
		$scope.tarea = tarea;
		$scope.seguimiento = new Seguimiento();
		$scope.dateSeg = undefined;
		if(seguimiento){
			angular.copy(seguimiento, $scope.seguimiento)
			$scope.dateSeg = $filter('date')($scope.seguimiento.fecha, "dd/MM/yyyy");;
		}

	}

	$scope.alert = function(titulo, mensaje, tipo, duracion){
		$scope.titulo = titulo;
		$scope.mensaje = mensaje;
		$scope.alertType = tipo;
		$scope.showAlert = true;
		setTimeout(function(){
			$scope.showAlert = false;
			$scope.$apply();
		}, duracion);
	}

	$scope.message = function(prop){
		if(!prop.error){
			prop.title = "<div class='title-success'>" + prop.title + "</div>"
			prop.content = "<div class='muted'>" + prop.content + "</div>"
		} else {
			prop.title = "<div class='title-error'> " + prop.title + "</div>"
			prop.content = "<div class='muted'>" + prop.content + "</div>"
		}

		angular.element(prop.element).popover({
			"title": prop.title,
			"placement": prop.position,
			"content": prop.content,
			"trigger": prop.trigger,
			"delay": prop.delay,
			"unique": prop.unique,
			"html" : true});
		if(prop.action){
			angular.element(prop.element).popover(prop.action);
		}else{
			angular.element(prop.element).popover('show');
			setTimeout(function(){
				angular.element(prop.element).popover('hide');
				angular.element(prop.element).popover('destroy');
			}, prop.timeout);
		}
	}


	$scope.eliminarSeguimiento = function(seguimiento, tarea){
		seguimiento.idTarea = tarea.id;
		Resource.getResource(
			seguimiento._links.delete.href
		).delete(seguimiento,

			function(success, putResponseHeaders){

				var seguimientos = _.reject(tarea._embedded.seguimientos,
				 	function(value) {
				  		return (value.id == seguimiento.id);
					});

				tarea._embedded.seguimientos = seguimientos;

				var mensaje = "El Seguimiento '" + seguimiento.titulo + "' fue eliminado con exito",
				titulo = "Eliminar Seguimiento: ",
				duracion = 4000,
				tipo = 'alert-success';
				$scope.alert(titulo, mensaje, tipo, duracion);
			},
			function(failure, putResponseHeaders){
				var mensaje = "Error al eliminar el seguimiento '" + seguimiento.titulo + "'",
				duracion = 4000,
				titulo = "Eliminar Seguimiento: ",
				tipo = 'alert-error';

				$scope.alert(titulo, mensaje, tipo, duracion);
			});
	}

	$scope.changeDateEvent = function(elementID){
		var t = $scope.tarea;

		destroyDateWarnings('#fechaInicio');
		destroyDateWarnings('#fechaRevision');
		destroyDateWarnings('#fechaVencimiento');

		if(!(compararFechas(t.fechaInicio, t.fechaVencimiento))){
			scope.invalidDate = true;
			scope.message({
				"element": '#fechaVencimiento',
				"title" : 'Fecha No Valida',
				"position": 'top',
				"content" : 'La tarea no puede vencer o revisarse antes de iniciar',
				"timeout" : 3000,
				"error" : true,
				"trigger" : "manual",
				"delay" : 1000,
				"unique": 1,
				"action" :'show'
			});
		}

		if(!(compararFechas(t.fechaRevision, t.fechaVencimiento))){
			scope.invalidDate = true;
			scope.message({
				"element": "#fechaVencimiento",
				"title" : 'Fecha No Valida',
				"position": 'top',
				"content" : 'La tarea no puede vencer o revisarse antes de iniciar',
				"timeout" : 3000,
				"error" : true,
				"trigger" : "manual",
				"delay" : 1000,
				"unique": 1,
				"action" :'show'
			});
		}

		if(!(compararFechas(t.fechaInicio, t.fechaRevision))){
			scope.invalidDate = true;
			scope.message({
				"element": "#fechaRevision",
				"title" : 'Fecha No Valida',
				"position": 'bottom',
				"content" : 'La tarea no puede vencer o revisarse antes de iniciar',
				"timeout" : 3000,
				"error" : true,
				"trigger" : "manual",
				"delay" : 1000,
				"unique": 1,
				"action" :'show'
			});
		}

	}

	function crearTarea(){
		$scope.tarea = new Tarea();
		$scope.form_action = "Nueva Tarea";
		$scope.tarea.tipo = new Tipo();
		$scope.tarea.estado = 'Nueva';
		$scope.tarea.prioridad = 'Sin Apuro'
		$scope.tarea.asignados = [];
		$scope.tarea.seguidores = [];
		$scope.tarea.responsable = $rootScope.userId;
		$scope.tarea.borrado = false;
	}

	function crearSubTarea(tarea){

		$scope.tarea.idTareaSuperior = tarea.id;
		$rootScope.idTarea = tarea.id

		$scope.tarea.fechaInicio = $filter('date')(tarea.fechaInicio, "dd/MM/yyyy");
		$scope.tarea.fechaVencimiento = $filter('date')(tarea.fechaVencimiento, "dd/MM/yyyy");
		$scope.dateInicia = $scope.tarea.fechaInicio;
		$scope.dateVence = $scope.tarea.fechaVencimiento;
		$scope.showTiempo = !(_.isEmpty($scope.tarea.fechaInicio) && _.isEmpty($scope.tarea.fechaVencimiento));
		$scope.tarea.tipo = getProperty("tipo", tarea);
		$scope.showTipo = !(_.isEmpty($scope.tarea.tipo));
		$rootScope.showDeleteTipo = true;

		$scope.form_action = "Sub-Tarea de " + tarea.asunto;

	}

	function getProperty(property, object){
		if(object._embedded && object._embedded[property] != undefined){
			return object._embedded[property];
		} else {
			return [];
		}

	}

	function refresh(){
		var url = $rootScope.user._links.appRoot.href;
		$scope.tareas = Resource.getResource(url).find({
			page: $rootScope.page,
			itemsPerPage: $rootScope.items,
			sortBy: $rootScope.sortBy,
			q: $rootScope.query,
			userId: $rootScope.userId,
			filtro: $rootScope.filtro,
			tareaSuperior: $rootScope.idTarea

		})

	}

	function compararFechas(fechaMenor, fechaMayor){
		fechaMenor = ($filter('date')(fechaMenor, "yyyyMMdd"));
		fechaMayor = ($filter('date')(fechaMayor, "yyyyMMdd"));

		if(fechaMenor == undefined || fechaMayor == undefined){
			return true;
		}

		return (fechaMenor <= fechaMayor);
	}

	function destroyDateWarnings(elementID){
		scope.message({
			element: elementID,
			action: 'destroy'
		});
		scope.invalidDate = false;
	}


}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	// $scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}
