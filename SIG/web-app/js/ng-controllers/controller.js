function ListaTareaCtrl($scope, $routeParams, $location, $rootScope, $filter, Usuario,
 Tarea, Tipo, Seguimiento, $document) {
	
	// var page = $routeParams.page ? $routeParams.page : 0;
	// var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	// var sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	// var query = $routeParams.q ? $routeParams.q : "";
	// var filtro = $routeParams.filtro ? $routeParams.filtro : "todas";
	// var idTarea = $routeParams.idTarea ? $routeParams.idTarea : "";

	$rootScope.page = $routeParams.page ? $routeParams.page : 0;
	$rootScope.items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	$rootScope.sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	$rootScope.query = $routeParams.q ? $routeParams.q : "";
	$rootScope.filtro = $routeParams.filtro ? $routeParams.filtro : "todas";
	$rootScope.idTarea = $routeParams.idTarea ? $routeParams.idTarea : "";

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

	if($routeParams.userId){
		$rootScope.userId = ($rootScope.userId != $routeParams.userId) ? $routeParams.userId : $rootScope.userId;
		$rootScope.user = Usuario.get({"idUsuario": $rootScope.userId});
		
		$scope.tareas = Tarea.query({
			"page": $rootScope.page,
			"itemsPerPage" : $rootScope.items,
			"sortBy": $rootScope.sortBy,
			"q": $rootScope.query,
			userId: $rootScope.userId,
			filtro: $rootScope.filtro,
			tareaSuperior: $rootScope.idTarea
		});
		
	}

	// $scope.hover = false;
	// $scope.query = $rootScope.query;
	// $scope.sortBy = $rootScope.sortBy;

	$scope.sort = function(field) {
		$location.search("sortBy", field);
		// $scope.tareas = Tarea.query({
		// 	"page": $rootScope.page,
		// 	"itemsPerPage" : $rootScope.items,
		// 	"sortBy": field,
		// 	"q": $rootScope.query,
		// 	userId: $rootScope.userId,
		// 	filtro: $rootScope.filtro,
		// 	tareaSuperior: $rootScope.idTarea
		// });
		$rootScope.sortBy = field;
	}

	$scope.search = function(query){
		// $rootScope.navigation = undefined;
		// $routeParams.idTarea = "";
		// $rootScope.idTarea = "";
		$rootScope.query = query;
		$location.search({q: $rootScope.query, page: 0});
		
		// $scope.tareas = Tarea.query({
		// 	"page": 0,
		// 	"itemsPerPage" : $rootScope.items,
		// 	"sortBy": $rootScope.sortBy,
		// 	"q": query,
		// 	userId: $rootScope.userId,
		// 	filtro: "todas",
		// 	tareaSuperior: ""
		// });

	}



	$scope.changeFilter = function(filterName){
		var loc = $rootScope.userId + "/tarea" ; 
		if(filterName){
			loc = $rootScope.userId + "/" + filterName + "/tarea";
		}
		$location.url(loc);
		// $scope.tareas = Tarea.query({
		// 	"page": 0,
		// 	"itemsPerPage" : $rootScope.items,
		// 	"sortBy": $rootScope.sortBy,
		// 	"q": "",
		// 	userId: $rootScope.userId,
		// 	filtro: filterName,
		// 	tareaSuperior: ""
		// });
		$rootScope.filtro = filterName;
		$rootScope.navigation = undefined;
		$rootScope.query = "";
		$scope.query = "";
	}

	$scope.$on('filter', function(event, filter){
		// var q = "/tarea" + (filter != '' ? ("?q=" + filter) : '')
		// $location.url($rootScope.userId + q);
		if(filter != ''){
			$location.search({q: filter});
			
		} else{
			$location.url($rootScope.userId + '/tarea' + '/' + $rootScope.idTarea);
		}

		// $scope.tareas = Tarea.query({
		// 	"page": 0,
		// 	"itemsPerPage" : $rootScope.items,
		// 	"sortBy": $rootScope.sortBy,
		// 	"q": filter,
		// 	userId: $rootScope.userId,
		// 	filtro: $rootScope.filtro,
		// 	tareaSuperior: $rootScope.idTarea
		// });
		// $rootScope.query = filter;
		// $scope.query = filter;
		
	});

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

		$rootScope.navigation.push(tarea);
		$location.url(tarea._links.self.href);
		$routeParams.page = 0;
		// $scope.tareas = Tarea.query({
		// 	"page": 0,
		// 	"itemsPerPage" : $rootScope.items,
		// 	"sortBy": $rootScope.sortBy,
		// 	"q": $rootScope.query,
		// 	userId: $rootScope.userId,
		// 	filtro: $rootScope.filtro,
		// 	tareaSuperior: tarea.id
		// });

		$rootScope.idTarea = tarea.id;
	}

	$scope.nuevaTarea = function(tarea){
		$scope.form = 'tarea';
		$scope.showTipo = false;
		$scope.showTiempo = false;
		$scope.showAsigna = false;
		$scope.showDesc = false;
		if(!tarea){
			crearTarea();
		}else {
			crearTarea();
			crearSubTarea(tarea);
		}
		
	}

	$scope.editarTarea = function(t){
		$scope.form = 'tarea';
		$scope.tarea = new Tarea();
		angular.copy(t, $scope.tarea);
		
		$scope.tarea.asunto = t.asunto;
		$scope.tarea.tipo = getProperty("tipo", $scope.tarea);
		$scope.showTipo = !(_.isEmpty($scope.tarea.tipo));

		$scope.tarea.fechaInicio = $filter('date')($scope.tarea.fechaInicio, "dd/MM/yyyy");
		$scope.tarea.fechaVencimiento = $filter('date')($scope.tarea.fechaVencimiento, "dd/MM/yyyy");
		$scope.dateInicia = $scope.tarea.fechaInicio
		$scope.dateVence = $scope.tarea.fechaVencimiento
		$scope.showTiempo = !(_.isEmpty($scope.tarea.fechaInicio) && _.isEmpty($scope.tarea.fechaVencimiento));

		$scope.tarea.asignados = getProperty("asignados", $scope.tarea);
		$scope.tarea.seguidores = getProperty("seguidores", $scope.tarea);
		$scope.showAsigna = !(_.isEmpty($scope.tarea.asignados) && _.isEmpty($scope.tarea.seguidores));

		$scope.showDesc = !(_.isEmpty($scope.tarea.descripcion));
		
		$scope.form_action = "Editar Tarea";
		
	}

	$scope.save = function(tarea){
		var tareas = $scope.tareas._embedded.collection;

		$scope.tarea = new Tarea();
		angular.copy(tarea, $scope.tarea);

		$scope.tarea.fechaInicio = $filter('date')($scope.tarea.fechaInicio, "dd/MM/yyyy");
		$scope.tarea.fechaVencimiento = $filter('date')($scope.tarea.fechaVencimiento, "dd/MM/yyyy");

		if($scope.tarea.id){
			$scope.tarea.$update({idTarea: $scope.tarea.id, userId: $rootScope.userId},
			function(tarea, putResponseHeaders){
				removeObject(tareas, tarea, "id");
				if($scope.tareas._embedded.collection) {
					if(!tarea.borrado){
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
					$scope.tareas._embedded.collection.push(tarea);
					$scope.tareas.data.total = $scope.tareas.data.total + 1;
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
			"content": prop.content,
			"trigger": prop.trigger,
			"delay": prop.delay,
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
		$scope.form_action = "Sub-Tarea de " + tarea.asunto;
		
	}

	function getProperty(property, object){
		if(object._embedded && object._embedded[property] != undefined){
			return object._embedded[property];
		} else {
			return [];
		}

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
				console.log($scope);
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
			$scope.showDeleteTipo = $scope.checkForDuplicate("nombre", tipo.nombre, $scope.tipos);
		}else {
			$scope.showAddTipo = false;
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

	$scope.deleteTipo = function(tipo){
		var t = new Tipo(tipo);
		for (var i = 0; i < $scope.tipos.length; i++) {
			if($scope.tipos[i].id == tipo.id){
				$scope.tipos.splice(i, 1);
				$scope.tarea.tipo.nombre = "";
			}
		};

		t.$delete({idTipo: tipo.id}, function(t, putResponseHeaders){
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

