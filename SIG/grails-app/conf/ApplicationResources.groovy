modules = {
    application {
		dependsOn 'angular', 'angular-resource'
		resource url:'js/angular/i18n/angular-locale_es.js', disposition: 'head'
		resource url:'js/application.js', disposition: 'head'
		resource url:'js/ng-controllers/controller.js', disposition: 'head'
		resource url:'js/ng-services/services.js', disposition: 'head'
		resource url:'css/custom.css'
		
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