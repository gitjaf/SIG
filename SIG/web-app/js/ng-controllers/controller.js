function ListaTareaCtrl($scope, $routeParams, $location, Tarea, $rootScope) {
	
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
		$scope.tarea.asignados = [];
		$scope.tarea.seguidores = [];
		$scope.tarea.responsable = $rootScope.userId;
	}

}

function DetalleTareaCtrl($scope, $routeParams, Tarea) {
	$scope.tarea = Tarea.get({idTarea:$routeParams.tareaId});
}

function FormTareaCtrl($scope, $routeParams, Tarea, Usuario) {
	var formElements = ['#form_asunto', '#form_inicio', '#form_vence', '#form_estado', '#form_prioridad', '#form_sigue', '#form_asigna',
		'#form_desc'];
	var page = 0;
	var items = 0;
	var sort = "apellidos"
	var q = ""

	$scope.usuarios = Usuario.query({"page": page, "itemsPerPage": items, "sortBy": sort, "q": q});

	
	$scope.filler = function(k, v){
		$scope.usuario = k;
		$scope.id = v;
	}

	$scope.agregar = function(usuario, id, collection) {
		var fields = ["#form_asigna", "#form_sigue"]
		var duplicate = $scope.checkForDuplicate(id, $scope.tarea.asignados) || $scope.checkForDuplicate(id, $scope.tarea.seguidores);
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

	$scope.checkForDuplicate = function(id, collection){
		var duplicate = false;
		angular.forEach(collection, function(item){
			duplicate = duplicate || (angular.equals(item.id, id));
		});
		
		return duplicate;
	}
	
}


