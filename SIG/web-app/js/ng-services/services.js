angular.module('sigServices', ['ngResource']).
	factory('Tarea', function($resource){
		return $resource('/SIG/tarea/:idTarea', {page: '@page', itemsPerPage: '@itemsPerPage'}, {
			query: {method: 'GET', params:{}, isArray: false}
		});
	});