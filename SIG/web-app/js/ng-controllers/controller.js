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
				$location.url("/tarea")
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

	$scope.addCrumb = function(tarea){
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
		$location.url(tarea._links.self.href+"/"+$rootScope.filtro);
		$routeParams.page = 0;
		$rootScope.idTarea = tarea.id;
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
			
			$scope.tarea.$update({idTarea: $scope.tarea.id, userId: $rootScope.userId},
			function(tarea, putResponseHeaders){
				removeObject(tareas, tarea, "id");
				if($scope.tareas._embedded.collection) {
					if(!tarea.borrado && !restaurada){
						$scope.tareas._embedded.collection.push(tarea);
					} else {
						$scope.tareas.data.total = $scope.tareas.data.total - 1;
					}
				} else {
					$scope.tareas._embedded.collection = [tarea];
				}
				var mensaje = "La tarea '" + tarea.asunto + "' fue editada con exito",
				titulo = "Editar Tarea: ",
				duracion = 4000,
				tipo = 'alert-success';
				$scope.alert(titulo, mensaje, tipo, duracion);
				
			}, function(response, putResponseHeaders){
				var mensaje = "Error al editar la tarea '" + $scope.tarea.asunto + "'",
				duracion = 4000,
				titulo = "Editar Tarea: ",
				tipo = 'alert-error';

				$scope.alert(titulo, mensaje, tipo, duracion);	
			});
		} else {
			$scope.tarea.$save(function(tarea, putResponseHeaders){
				if(_($scope.tareas._embedded.collection).isEmpty()) {
					$scope.tareas = Tarea.query({
										"page": $rootScope.page,
										"itemsPerPage" : $rootScope.items,
										"sortBy": $rootScope.sortBy,
										"q": $rootScope.query,
										userId: $rootScope.userId,
										filtro: $rootScope.filtro,
										tareaSuperior: $rootScope.idTarea
									});
				} else {
					var tareaSuperior;
					if(idTareaSuperior){
						 tareaSuperior = _($scope.tareas._embedded.collection).find( function(value) {
						  return value.id == idTareaSuperior;
						});
					} 

					if(tareaSuperior){
						if(tareaSuperior._embedded.tareasRelacionadas){
							tareaSuperior._embedded.tareasRelacionadas.push(tarea);
						}else {
							tareaSuperior._embedded.tareasRelacionadas = [tarea];
						}
						$scope.$broadcast('subtareaAgregada');
					} else {
						$scope.tareas._embedded.collection.push(tarea);
						$scope.tareas.data.total = $scope.tareas.data.total + 1;
					}
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

	$scope.borrar = function(tarea){
		var tareas = $scope.tareas._embedded.collection;

		$scope.tarea = new Tarea();
		angular.copy(tarea, $scope.tarea);

		$scope.tarea.$delete({idTarea: $scope.tarea.id, userId: $rootScope.userId},
			function(response, putResponseHeaders){
				removeObject(tareas, tarea, "id");
				$scope.tareas.data.total = $scope.tareas.data.total - 1;
				
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
				
				$scope.alert(titulo, mensaje, tipo, duracion);
				$scope.tareas._embedded.collection = [];		
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
	}

	$scope.verDetalleTarea = function(tarea){
		$scope.showDetalle = true;
		setTimeout(function(){
			$scope.safeApply(function(){
				$scope.detalle = tarea;
			});
		}, 300);
	}

	
	$scope.ocultarDetalle = function(){
		$scope.showDetalle = undefined;
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
		var seg = new Seguimiento();
		angular.copy(seguimiento, seg);

		seg.$delete({idTarea: tarea.id, idSeguimiento: seg.id, userId: $rootScope.userId},
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
		var url = '/tarea';

		$scope.tareas = Resource.getResource(url).query({
			"page": $rootScope.page,
			"itemsPerPage" : $rootScope.items,
			"sortBy": $rootScope.sortBy,
			"q": $rootScope.query,
			userId: $rootScope.userId,
			filtro: $rootScope.filtro,
			tareaSuperior: $rootScope.idTarea
			});

		// $resource(url, {}, 
		// 	{
		// 		query: {method: 'GET', params:{page: '@page', itemsPerPage: '@itemsPerPage',
		// 	 		sortBy: '@sortBy', q: '@q', userId:'@userId', filtro: '@filtro'}, isArray: false},
			 	
		// 	 	update: {method: 'PUT', params:{idTarea: '@id', userId:'@userId'}},

		// 	 	delete: {method: 'DELETE', params:{idTarea: '@id', userId: '@userId'}},
				
		// 		vaciarPapelera: {method: 'DELETE', params:{userId: '@userId'}}
		// 	}).query({
		// 		"page": $rootScope.page,
		// 		"itemsPerPage" : $rootScope.items,
		// 		"sortBy": $rootScope.sortBy,
		// 		"q": $rootScope.query,
		// 		userId: $rootScope.userId,
		// 		filtro: $rootScope.filtro,
		// 		tareaSuperior: $rootScope.idTarea
		// 	});



		// $scope.tareas = Tarea.query({
		// 	"page": $rootScope.page,
		// 	"itemsPerPage" : $rootScope.items,
		// 	"sortBy": $rootScope.sortBy,
		// 	"q": $rootScope.query,
		// 	userId: $rootScope.userId,
		// 	filtro: $rootScope.filtro,
		// 	tareaSuperior: $rootScope.idTarea
		// });

	}

	function compararFechas(fechaMenor, fechaMayor){
		fechaMenor = ($filter('date')(fechaMenor, "dd/MM/yyyy"));
		fechaMayor = ($filter('date')(fechaMayor, "dd/MM/yyyy"));
		
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

function FormTareaCtrl($rootScope, $scope, $routeParams, $filter, Tarea, Usuario, Tipo) {
	var formElements = ['#form_asunto', '#form_inicio', '#form_vence', '#form_sigue', '#form_asigna',
		'#form_desc'];
	var page = 0;
	var items = 0;
	var sort = "apellidos"
	var q = ""


	$scope.usuarios = Usuario.query({"page": page, "itemsPerPage": items, "sortBy": sort, "q": q});

	$scope.tipos = Tipo.query({q: '', userId: ''});
	
	$scope.showAddTipo = false;
	$scope.showEditTipo = false;
	$scope.showDeleteTipo = false;
	
	
		
	$scope.selectUser = function(k, v){
		$scope.usuario = k;
		$scope.id = v;
	}

	$scope.agregar = function(usuario, id, collection, elemento) {
		var fields = ["#form_asigna", "#form_sigue"]
		if(usuario !== undefined && id !== undefined){
		var duplicate = $scope.checkForDuplicate("id", id, $scope.tarea.asignados) 
				|| $scope.checkForDuplicate("id", id, $scope.tarea.seguidores);
			if(!duplicate){
				collection.push(($filter('filter')($scope.usuarios, function(u){
					return (u.id == id);
				}))[0]);
				$scope.clean(fields);
				$scope.usuario = undefined;
				$scope.id = undefined;
			} else{
				
				$scope.message({
					"element": elemento,
					"title" : 'Asignar un usuario', 
					"content" : 'El usuario ya esta asignado en otro rol',
					"timeout" : 3000,
					"error" : true,
					"trigger" : "manual",
					"delay" : 1000
					
			});
			}
		}
	}

	$scope.remover = function(index, collection){
		collection.splice(index, 1);
	}

	$scope.cleanAll = function(){
		$scope.clean(formElements);
		$scope.nuevaTarea();
		$scope.showAddTipo = false;
		$scope.showEditTipo = false;
		$scope.showDeleteTipo = false;
	}

	$scope.clean = function(elements){
		for(var e in elements){
			angular.element(elements[e]).val("");
		}
	}

	$scope.checkForDuplicate = function(property, value, collection){
		var duplicate = false
		angular.forEach(collection, function(item){
			if(item[property].toString().toLowerCase() == value.toString().toLowerCase()) {
				duplicate = true;
				return;
			}
		});
		return duplicate;
	}

	$scope.selectTipo = function(tipo){
		$scope.tarea.tipo = angular.copy(tipo);
		
		if(isAdmin($rootScope.userId)){
			$scope.showAddTipo = false;
			$scope.showEditTipo = false;
			$scope.showDeleteTipo = true;
		}
	}

	$scope.autocompleteTipo = function(k, v){
		var tipo = {"nombre": k, "id": v};
		$scope.selectTipo(tipo);
		$scope.$apply();
	}

	$scope.checkTipo = function(tipo){
		if(isValidTipo(tipo.nombre)){
			$scope.showAddTipo = !$scope.checkForDuplicate("nombre", tipo.nombre, $scope.tipos);
			$scope.showEditTipo = !$scope.checkForDuplicate("nombre", tipo.nombre, $scope.tipos);
			$scope.showDeleteTipo = $scope.checkForDuplicate("nombre", tipo.nombre, $scope.tipos);
		}else {
			$scope.showAddTipo = false;
			$scope.showEditTipo = false;
			$scope.showDeleteTipo = false;
		}
	}

	$scope.saveTipo = function(nombre){
		var t = new Tipo();
		t.nombre = nombre;
		t.$save(function(t,putResponseHeaders){
			addTipo(t);
			$scope.checkTipo(t);
			$scope.message({
				"element" : '#form_tipo',
				"title" : 'Crear Clasificación',
				"content" : 'Clasificación creada con éxito',
				"timeout" : 3000,
				"error" : false,
				"delay" : 1000,
				"trigger" : "manual"
			});
		}, function(response, putResponseHeaders){
			$scope.message({
				"element" : '#form_tipo',
				"title" : 'Crear Clasificación',
				"content" : 'Error al intentar crear la clasificación ' + nombre,
				"timeout" :  3000,
				"error" : true,
				"delay" : 1000,
				"trigger" : "manual"
			});
		});
	
	}

	$scope.editTipo = function(tipo){
		var t = new Tipo(tipo);

		t.$update({idTipo: tipo.id, userId: $rootScope.userId},
			
			function(t, putResponseHeaders){
				$scope.message({
					"element" : '#form_tipo',
					"title" : 'Editar Clasificación',
					"content" : 'Clasificación editada con éxito',
					"timeout" : 3000,
					"error" : false,
					"delay" : 1000,
					"trigger" : "manual"
				});	
				removeTipo(tipo);
				addTipo(t);
				if($rootScope.tareaSuperior){
					$rootScope.tareaSuperior._embedded.tipo = t;
				}
				$scope.$emit('refresh');
				
			},

			function(response, putResponseHeaders){
				$scope.message({
					"element" : '#form_tipo',
					"title" : 'Editar Clasificación',
					"content" : 'Error al intentar editar una clasificación',
					"timeout" :  3000,
					"error" : true,
					"delay" : 1000,
					"trigger" : "manual"
				});
			}
		);

		$scope.checkTipo($scope.tarea.tipo);
	}

	$scope.deleteTipo = function(tipo){
		var t = new Tipo(tipo);
		
		t.$delete({idTipo: tipo.id}, function(t, putResponseHeaders){
			removeTipo(tipo);
			$scope.message({
				"element" : '#form_tipo',
				"title" : 'Eliminar Clasificación',
				"content" : 'Clasificación eliminada con éxito',
				"timeout" : 3000,
				"error" : false,
				"delay" : 1000,
				"trigger" : "manual"
			});

		}, function(response, putResponseHeaders){
			
			$scope.message({
				"element" : '#form_tipo',
				"title" : 'Eliminar Clasificación',
				"content" : 'Error al intentar eliminar una clasificación',
				"timeout" :  3000,
				"error" : true,
				"delay" : 1000,
				"trigger" : "manual"
			});
		});
		
		$scope.checkTipo($scope.tarea.tipo);
	}

	$scope.clearDate = function(elemento, atributo){
		angular.element(elemento).val("");
		$scope.tarea[atributo] = undefined;
		$scope.message({
			"element" : "#add_on_vence",
			"action" : 'destroy'
		});
		$scope.invalidDate = false;
	}

	function isAdmin(id){
		//Por ahora el unico administrador es el usuario con id 1
		//TODO implementar un criterio para distinguir administradores de usuarios
		return id == 1;
	}

	function isValidTipo(tipo){
		return (isAdmin($rootScope.userId) && tipo.length > 3);
	}

	function addTipo(tipo){
		$scope.tipos.push(tipo);
		$scope.tarea.tipo = angular.copy(tipo);
	}
	
	function removeTipo(tipo){
		for (var i = 0; i < $scope.tipos.length; i++) {
			if($scope.tipos[i].id == tipo.id){
				$scope.tipos.splice(i, 1);
				$scope.tarea.tipo.nombre = "";
			}
		};
	}

}

// --- FUNCIONES AUXILIARES -----

/* Elimina un objeto de una colección.
	Recibe como parametros la coleccion, el objeto a eliminar de la colección y
	la property con la cual realizar la comparación para identificar el objeto
	dentro de la colección.
*/
function removeObject(collection, object, property){
	for (var i = 0; i < collection.length; i++) {
		if(collection[i][property] == object[property]){
			collection.splice(i, 1);
		}
	};
}


