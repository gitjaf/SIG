angular.module('sigServices', ['ngResource']).
	factory('Tarea', function($resource){
		return $resource('/SIG/tarea/:idTarea', {}, {
			query: {method: 'GET', params:{}, isArray:true}
		});
	});