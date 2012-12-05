var services = angular.module('sig.services', ['ngResource'])
	

services.factory('Tarea', function($resource){
	return $resource('/SIG/tarea/:idTarea', {page: '@page', itemsPerPage: '@itemsPerPage', sortBy: '@sortBy', q: '@q'}, 
		{query: {method: 'GET', params:{}, isArray: false}});
});

services.factory('Usuario', function($resource){
	return $resource('/SIG/usuario/:idUsuario', {page: '@page', itemsPerPage: '@itemsPerPage', sortBy: '@sortBy', q: '@q'},
		{query: {method: 'GET', params: {}, isArray: true}});
});