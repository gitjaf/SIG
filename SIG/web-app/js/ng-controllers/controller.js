function ListaTareaCtrl($scope, $routeParams, $location, $rootScope, Tarea, Tipo) {
	
	var page = $routeParams.page ? $routeParams.page : 0;
	var items = $routeParams.itemsPerPage ? $routeParams.itemsPerPage : 10;
	var sortBy = $routeParams.sortBy ? $routeParams.sortBy : "fechaInicio";
	var query = $routeParams.q ? $routeParams.q : "";

	if($routeParams.userId){
		$rootScope.userId = ($rootScope.userId != $routeParams.userId) ? $routeParams.userId : $rootScope.userId;
	
		$scope.tareas = Tarea.query({"page": page, "itemsPerPage" : items, "sortBy": sortBy,
	 	"q": query, userId: $rootScope.userId});
	}

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

	$scope.nuevaTarea = function(){
		$scope.form_action = "Nueva Tarea";
		$scope.tarea = new Tarea();
		$scope.tarea.tipo = new Tipo();
		$scope.tarea.estado = 'Nueva';
		$scope.tarea.prioridad = 'Sin Apuro'
		$scope.tarea.asignados = [];
		$scope.tarea.seguidores = [];
		$scope.tarea.responsable = $rootScope.userId;
		
	}

	$scope.save = function(){
		$scope.tarea.$save(function(tarea, putResponseHeaders){
			$scope.tareas._embedded.collection.splice(0,0,tarea);
			$scope.tareas.data.total = $scope.tareas.data.total + 1;
			$scope.message({
				"element" : "#nueva",
				"title" : "Nueva Tarea",
				"content" : "La tarea '" + tarea.asunto + "' fue creada con exito",
				"trigger" : "manual",
				"delay" : 1000,
				"timeout" : 3000,
				"error": false

			});
		},function(response, putResponseHeaders){
			$scope.message({
				"element" : "#nueva",
				"title" : "Nueva Tarea",
				"content" : "Error al crear la tarea '" + $scope.tarea.asunto + "'",
				"trigger" : "manual",
				"delay" : 1000,
				"timeout" : 3000,
				"error": true

			});
		});
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

}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}

function FormTareaCtrl($rootScope, $scope, $routeParams, Tarea, Usuario, Tipo) {
	var formElements = ['#form_asunto', '#form_inicio', '#form_vence', '#form_estado', '#form_prioridad', '#form_sigue', '#form_asigna',
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
		var duplicate = $scope.checkForDuplicate("id", id, $scope.tarea.asignados) || $scope.checkForDuplicate("id", id, $scope.tarea.seguidores);
		if(!duplicate){
			if(usuario !== undefined && id !== undefined){
				collection.push({"nombre" : usuario, "id" : id});
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


