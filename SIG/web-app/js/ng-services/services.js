var services = angular.module('sig.services', ['ngResource'])
	

services.factory('Tarea', function($resource){
	return $resource('/SIG/tarea/:idTarea', {}, 
	{
		query: {method: 'GET', params:{page: '@page', itemsPerPage: '@itemsPerPage',
	 		sortBy: '@sortBy', q: '@q', userId:'@userId'}, isArray: false},
	 	
	 	update: {method: 'PUT', params:{idTarea: '@id', userId:'@userId'}}
	
	});
});

services.factory('Usuario', function($resource){
	return $resource('/SIG/usuario/:idUsuario', {},
		{
			query: {method: 'GET', params: {page: '@page', itemsPerPage: '@itemsPerPage',
	 			sortBy: '@sortBy', q: '@q'}, isArray: true}
	 	});
});

services.factory('Tipo', function($resource){
	return $resource('/SIG/clasificacion/:idTipo', {},
			{
				query: {method: 'GET', params:{q: '@q', userId: '@userId'}, isArray: true}
			});
});

services.factory('Seguimiento', function($resource){
	return $resource('/SIG/seguimiento/:idSeguimiento',{},
	{
		query: {method: 'GET', params:{q: '@q', userId: '@userId'}, isArray: true},

		update: {method: 'PUT', params:{idTarea: '@idTarea', idSeguimiento: '@id',
		 userId:'@userId'}},

		delete: {method: 'DELETE', params:{idTarea: '@idTarea', idSeguimiento: '@id',
		 userId:'@userId'}}
	});
});