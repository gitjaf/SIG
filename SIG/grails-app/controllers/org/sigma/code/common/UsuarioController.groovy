
package org.sigma.code.common

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON
import grails.plugins.springsecurity.Secured


class UsuarioController {

    static allowedMethods = [show: ["GET", "POST"]]

    def halBuilderService
    
    def halCollectionBuilderService

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def list() {
                
		def list = halBuilderService.buildModelList(Usuario.list(sort:"persona.apellidos"))

		response.status = 200
		
		render list as JSON
    }
    
    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def show() {
        def usuarioInstance = Usuario.get(params.id)
        if (!usuarioInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'usuario.label', default: 'Usuario'), params.id])
            response.status = 404
			render flash.message
            return
        }
		response.status = 200
        render halBuilderService.buildModel(usuarioInstance) as JSON
    }
}
