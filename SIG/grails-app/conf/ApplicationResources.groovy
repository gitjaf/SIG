modules = {
    application {
		dependsOn 'angular', 'angular-resource', 'jquery-ui' 
		resource url:'js/angular/i18n/angular-locale_es.js', disposition: 'head'
		resource url:'js/application.js', disposition: 'head'
		resource url:'js/ng-controllers/controller.js', disposition: 'head'
		resource url:'js/ng-controllers/seguimiento.js', disposition: 'head'
		
		resource url:'js/ng-services/services.js', disposition: 'head'
		resource url:'js/directives.js', disposition: 'head'
		resource url:'js/plugins/angular-ui/build/angular-ui.js', disposition: 'head'
		resource url:'js/plugins/datepicker/js/bootstrap-datepicker.js', disposition: 'head'
		resource url:'js/plugins/fixes/typeaheadmap.js', disposition: 'head'

		resource url:'css/custom.css', disposition:'head'
		resource url:'js/plugins/angular-ui/build/angular-ui.css', disposition:'head'
		resource url:'js/plugins/datepicker/css/datepicker.css', disposition:'head'
		resource url:'css/typeaheadmap.css', disposition: 'head'

		
    }
	
	customBootstrap {
		dependsOn 'bootstrap-responsive-css', 'bootstrap-js', 'font-awesome'
	}
	
	
	
//	test {
//		dependsOn 'angular-scenario'
//		resource url:'/js/controller.js'
//		resource url:'/js/unitTest.js'
//	}
}