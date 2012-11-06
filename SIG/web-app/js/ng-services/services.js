angular.module('sigServices', ['ngResource']).
	factory('Tarea', function($resource){
		return $resource('/SIG/tarea/:idTarea', {page: '@page', itemsPerPage: '@itemsPerPage', sortBy: '@sortBy'}, {
			query: {method: 'GET', params:{}, isArray: false}
		});
	});