function FormTareaCtrl($rootScope, $scope, $routeParams, $filter, Tarea, Usuario, Tipo, Resource, AuthService) {
	var formElements = ['#form_asunto', '#form_inicio', '#form_vence', '#form_sigue', '#form_asigna',
		'#form_desc'];
	var page = 0;
	var items = 0;
	var sort = "apellidos";
	var q = "";
	
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
	console.log($rootScope.user);
	console.log(AuthService.data);
	$scope.usuarios = Resource.getResource($rootScope.user._links.find.href)
		.query({"page": page, "itemsPerPage": items, "sortBy": sort, "q": q});
	
		
	
	// $scope.usuarios = Usuario.query({"page": page, "itemsPerPage": items, "sortBy": sort, "q": q});

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
		
		if(isAdmin($rootScope.user)){
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
		var t = new Object();
		t.nombre = nombre;

		Resource.getResource($rootScope.user._links.createClasificacion.href).create(t,
		
			function(t,putResponseHeaders){
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
			}
		);
	
	}

	$scope.editTipo = function(tipo){
	
		Resource.getResource(tipo._links.update.href).update(tipo,
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
		
		Resource.getResource(tipo._links.delete.href).delete(tipo,
			function(t, putResponseHeaders){
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
			}
		);
		
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

	function isAdmin(user){
		if(user._links.createClasificacion){
			return true
		}
		return false
	}

	function isValidTipo(tipo){
		return (isAdmin($rootScope.user) && tipo.length > 3);
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


