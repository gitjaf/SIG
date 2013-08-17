import org.codehaus.groovy.grails.commons.GrailsApplication;

import grails.util.GrailsUtil;
import org.sigma.code.tareas.*
import org.sigma.code.common.*

class BootStrap {

	def fixtureLoader // Autowired by Fixtures plugin
	def springSecurityService

    def init = { servletContext ->
		boolean isProd = GrailsUtil.environment == grails.util.Environment.PRODUCTION
		boolean isTest = GrailsUtil.environment == grails.util.Environment.TEST
		
		if (isTest){
			
			fixtureLoader.load('tareaFixtures')
		
			assert Tarea.count == 4
			
		}

		def userRole = Rol.findByAuthority('ROLE_USER') ?: new Rol(authority: 'ROLE_USER').save(failOnError: true)
        def adminRole = Rol.findByAuthority('ROLE_ADMIN') ?: new Rol(authority: 'ROLE_ADMIN').save(failOnError: true)
		
		def adminPerson = Persona.findByNombres('Administrador') ?: new Persona(
				nombres: 'Administrador',
				apellidos: 'GESIn'
			).save(failOnError: true)

		def adminUser = Usuario.findByUsername('gesindev') ?: new Usuario(
                username: 'gesindev',
                password: springSecurityService.encodePassword('qwe123'),
                persona: adminPerson,
                enabled: true).save(failOnError: true)

 
        if (!adminUser.authorities.contains(adminRole)) {
            RolUsuario.create adminUser, adminRole
        }
		
    }

    def destroy = {
    }
}
