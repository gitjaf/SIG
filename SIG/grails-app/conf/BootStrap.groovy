import org.codehaus.groovy.grails.commons.GrailsApplication;

import grails.util.GrailsUtil;
import org.sigma.code.tareas.*
import org.sigma.code.common.*

class BootStrap {

	def fixtureLoader // Autowired by Fixtures plugin
	
    def init = { servletContext ->
		boolean isProd = GrailsUtil.environment == grails.util.Environment.PRODUCTION
		boolean isTest = GrailsUtil.environment == grails.util.Environment.TEST
		if (isTest){
			
			fixtureLoader.load('tareaFixtures')
		
			assert Tarea.count == 4
			
		}
		
		
    }
    def destroy = {
    }
}
