if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

angular.module('sig', ['sig.services', 'sig.directives', 'ui', 'angular-underscore', '$strap.directives']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/login', {
        templateUrl: './ng-views/login.html',
        controller: LoginCtrl,
        access: {
            isFree: true
        }
    }).
    
    when('/tarea', {
        templateUrl: './ng-views/listado.html',
        controller: ListaTareaCtrl,
        access: {
            isFree: false
        }
        
    }).
    // when('/:userId/edit', {templateUrl: './ng-views/form.html', controller: FormTareaCtrl}).
	
    when('/tarea/:filtro', {
        templateUrl: './ng-views/listado.html', 
        controller: ListaTareaCtrl,
        access: {
            isFree: false
        }
    }).
    
    when('/tarea/:idTarea', {
        templateUrl: './ng-views/listado.html', 
        controller: ListaTareaCtrl,
        access: {
            isFree: false
        }
    }).
    
    when('/tarea/:idTarea/:filtro', {
        templateUrl: './ng-views/listado.html', 
        controller: ListaTareaCtrl,
        access: {
            isFree: false
        }
    }).
	
    otherwise({redirectTo: '/tarea'});
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

