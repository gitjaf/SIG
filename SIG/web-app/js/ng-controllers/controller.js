function ListaTareaCtrl($scope, $routeParams, $location, $rootScope, $filter, Tarea, Tipo, $document) {
	
	var page = $routeParams.page ? $routeParams.page : 0;
	var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	var sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	var query = $routeParams.q ? $routeParams.q : "";

	if($routeParams.userId){
		$rootScope.userId = ($rootScope.userId != $routeParams.userId) ? $routeParams.userId : $rootScope.userId;
	
		$scope.tareas = Tarea.query({"page": page, "itemsPerPage" : items, "sortBy": sortBy,
	 	"q": query, userId: $rootScope.userId});
	 	
	}

	$scope.hover = false;
	$scope.query = query;

	$scope.sort = function(field) {
		$location.search("sortBy", field);
	}

	$scope.search = function(query){
		$location.search("q", query);
		$location.search("page","0");
	}

	$scope.$on('filter', function(event, filter){
		var q = "/tarea" + (filter != '' ? ("?q=" + filter) : '')
		$location.url($rootScope.userId + q);
		
	});

	$scope.isActive = function(item) {
		if($routeParams.q){
			return $routeParams.q === item;
		}
		return undefined;
	}

	$scope.nuevaTarea = function(tarea){
		if(!tarea){
			crearTarea();
		}else {
			crearTarea();
			crearSubTarea(tarea);
		}
		
	}

	$scope.editarTarea = function(tarea){
		$scope.tarea = new Tarea();
		$scope.tarea.id = tarea.id;
		$scope.tarea.asunto = tarea.asunto;
		$scope.tarea.fechaInicio = $filter('date')(tarea.fechaInicio, "dd/MM/yyyy");
		$scope.tarea.fechaVencimiento = $filter('date')(tarea.fechaVencimiento, "dd/MM/yyyy");
		$scope.tarea.descripcion = tarea.descripcion;
		$scope.tarea.responsable = getProperty("responsable", tarea).id;
		$scope.tarea.estado = tarea.estado;
		$scope.tarea.prioridad = tarea.prioridad;
		$scope.tarea.asignados = getProperty("asignados", tarea);
		$scope.tarea.seguidores = getProperty("seguidores", tarea);
		$scope.tarea.tipo = getProperty("tipo", tarea);
		$scope.form_action = "Editar Tarea";
		angular.element('#form_inicio').val($scope.tarea.fechaInicio);
		angular.element('#form_vence').val($scope.tarea.fechaVencimiento);
	}

	$scope.save = function(){
		var tareas = $scope.tareas._embedded.collection;
		if($scope.tarea.id){
			$scope.tarea.$update({idTarea: $scope.tarea.id, userId: $rootScope.userId},
			function(tarea, putResponseHeaders){
				removeObject(tareas, tarea, "id");
				if($scope.tareasRecientes) {
					removeObject($scope.tareasRecientes, tarea, "id");
					$scope.tareasRecientes.splice(0,0,tarea)

				} else {
					$scope.tareasRecientes = [tarea];
				} 
				$scope.mensaje = "La tarea '" + tarea.asunto + "' fue editada con exito";
				$scope.titulo = "Editar Tarea: ";
				$scope.alert = true;
				$scope.alertType = 'alert-success';
				setTimeout(function(){
					$scope.alert = false;
					$scope.$apply();
					angular.element("#tarea"+tarea.id).addClass("edited");
				}, 3000);
				
			}, function(response, putResponseHeaders){
				$scope.mensaje = "Error al editar la tarea '" + $scope.tarea.asunto + "'";
				$scope.titulo = "Editar Tarea: ";
				$scope.alert = true;
				$scope.alertType = 'alert-error';
				setTimeout(function(){
					$scope.alert = false;
					$scope.$apply();
				}, 3000);
				
			})
			
		} else {

			$scope.tarea.$save(function(tarea, putResponseHeaders){
				//FIXME - Si la coleccion esta vacia (como ocurre con un nuevo usuario sin tareas asignadas)
				// esto tira error al crear la primer tarea - ARREGLAR
				if($scope.tareasRecientes) {
					$scope.tareasRecientes.splice(0,0,tarea)
				} else {
					$scope.tareasRecientes = [tarea];
				} 
				$scope.tareas.data.total = $scope.tareas.data.total + 1;
				$scope.mensaje = "La tarea '" + tarea.asunto + "' fue creada con exito";
				$scope.titulo = "Crear Tarea: ";
				$scope.alert = true;
				$scope.alertType = 'alert-success';
				setTimeout(function(){
					$scope.alert = false;
					$scope.$apply();
					angular.element("#tarea"+tarea.id).addClass("created");
				}, 3000);
				
			},function(response, putResponseHeaders){
				$scope.mensaje = "Error al crear la tarea '" + $scope.tarea.asunto + "'";
				$scope.titulo = "Crear Tarea: ";
				$scope.alert = true;
				$scope.alertType = 'alert-error';
				setTimeout(function(){
					$scope.alert = false;
					$scope.$apply();
				}, 3000);

			});
		}
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
			"delay": prop.delay});
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

	function crearTarea(){
		$scope.tarea = new Tarea();
		$scope.form_action = "Nueva Tarea";
		$scope.tarea.tipo = new Tipo();
		$scope.tarea.estado = 'Nueva';
		$scope.tarea.prioridad = 'Sin Apuro'
		$scope.tarea.asignados = [];
		$scope.tarea.seguidores = [];
		$scope.tarea.responsable = $rootScope.userId;
	}

	function crearSubTarea(tarea){
		console.log($scope.tarea);
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
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
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

	$scope.agregar = function(usuario, id, collection) {
		var fields = ["#form_asigna", "#form_sigue"]
		if(!duplicate){
			if(usuario !== undefined && id !== undefined){
				var duplicate = $scope.checkForDuplicate("id", id, $scope.tarea.asignados) || $scope.checkForDuplicate("id", id, $scope.tarea.seguidores);
				collection.push(($filter('filter')($scope.usuarios, function(u){
					return (u.id == id);
				}))[0]);
				$scope.clean(fields);
				$scope.usuario = undefined;
				$scope.id = undefined;
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

