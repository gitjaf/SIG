var services = angular.module('sig.services', ['ngResource'])


services.factory('AuthService', function($resource, $rootScope, $location){
	var authService = {
		
		data: {
			isLogged: false,
			usuario: undefined
		},

		authenticate: function(){
			$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
				var data = {url: "/login"};
				
				if(!currRoute.access.isFree) {
					authService.checkCredentials(data);
				}

			});
		},

		checkCredentials: function(data){

			authService.sdo(data).isLogged({},
				function(usuario, putResponseHeaders){
					authService.data.isLogged = true;
					authService.data.usuario = usuario;
					$rootScope.user = usuario;
					$rootScope.userId = usuario.id
					$rootScope.$broadcast("refresh");
				},
				
				function(response, putResponseHeaders){
					$rootScope.user = undefined;
					$rootScope.userId = undefined;
					$location.url(data.url);
				}
			);
		},

		sdo: function(data) {
			return	$resource(data.url, {}, {
				login: {
					method: 'POST',
					params: {
						username: '@username',
						password: '@password'
					}
				},

				logout: {
					method: 'GET',
					params: {}
				},

				isLogged: {
					method: 'GET',
					params: {}
				}
			})
		}
	}
	return authService;
});


services.factory('Resource', function($resource){
	
	return {
		getResource: function(url, params){
		
			if(params == undefined){
				params = {};
			}

			return $resource(url, params,
				{
					query: {
						method: 'GET', 
						params: {
							page: '@page',
							itemsPerPage: '@itemsPerPage',
							sortBy: '@sortBy',
							q: '@q',
							userId: '@userId',
							filtro: '@filtro',
							isArray: false
						}
					},

					update: {
						method: 'PUT',
						params: {
							id: '@id',
							userId: '@userId'
						}
					},

					delete: {
						method: 'DELETE',
						params: {
							id: '@id',
							userId: '@userId'
						}
					},

					deleteAll:{
						method: 'DELETE',
						params:{
							userId:'@userId'
						}
					}
				});
			}
		}
	});

services.factory('Tarea', function($resource){
	return $resource('/tarea/:idTarea', {}, 
	{
		query: {method: 'GET', params:{page: '@page', itemsPerPage: '@itemsPerPage',
	 		sortBy: '@sortBy', q: '@q', userId:'@userId', filtro: '@filtro'}, isArray: false},
	 	
	 	update: {method: 'PUT', params:{idTarea: '@id', userId:'@userId'}},

	 	delete: {method: 'DELETE', params:{idTarea: '@id', userId: '@userId'}},
		
		vaciarPapelera: {method: 'DELETE', params:{userId: '@userId'}}
	});
});

services.factory('Usuario', function($resource){
	return $resource('/usuario/:idUsuario', {},
		{
			query: {method: 'GET', params: {page: '@page', itemsPerPage: '@itemsPerPage',
	 			sortBy: '@sortBy', q: '@q'}, isArray: true}
	 	});
});

services.factory('Tipo', function($resource){
	return $resource('/clasificacion/:idTipo', {},
			{
				query: {method: 'GET', params:{q: '@q', userId: '@userId'}, isArray: true},
				
				update: {method: 'PUT', params:{idTipo: '@idTipo', userId: '@userId'}}
			});
});

services.factory('Seguimiento', function($resource){
	return $resource('/seguimiento/:idSeguimiento',{},
	{
		query: {method: 'GET', params:{q: '@q', userId: '@userId'}, isArray: true},

		update: {method: 'PUT', params:{idTarea: '@idTarea', idSeguimiento: '@id',
		 userId:'@userId'}},

		delete: {method: 'DELETE', params:{idTarea: '@idTarea', idSeguimiento: '@id',
		 userId:'@userId'}}
	});
});