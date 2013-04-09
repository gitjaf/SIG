if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

angular.module('sig', ['sig.services', 'sig.directives', 'ui', 'angular-underscore']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/:userId/tarea', {templateUrl: './ng-views/listado.html', controller: ListaTareaCtrl}).
	when('/:userId/edit', {templateUrl: './ng-views/form.html', controller: FormTareaCtrl}).
	when('/:userId/:filtro/tarea/', {templateUrl: './ng-views/listado.html', controller: ListaTareaCtrl}).
    when('/:userId/tarea/:idTarea', {templateUrl: './ng-views/listado.html', controller: ListaTareaCtrl}).
	otherwise({redirectTo: function(params, path, search){
		return (path + "tarea");
	}});
}]);

/**
     * Usage:
     *   {{some_text | cut:true:100:' ...'}}
     * Options:
     *   - wordwise (boolean) - if true, cut only by words bounds,
     *   - max (integer) - max length of the text, cut to this number of chars,
     *   - tail (string, default: '&nbsp;&hellip;') - add this string to the input
     *     string if the string was cut.
     */
    angular.module('ng').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

