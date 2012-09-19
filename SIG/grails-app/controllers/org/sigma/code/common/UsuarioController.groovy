
package org.sigma.code.common

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON



class UsuarioController {

    static allowedMethods = [show: ["GET", "POST"]]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
		
		def usuarioInstanceList = Usuario.list()
		
		response.status = 200
		
		render usuarioInstanceList as JSON
    }
    
    
    def show() {
        def usuarioInstance = Usuario.get(params.id)
        if (!usuarioInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'usuario.label', default: 'Usuario'), params.id])
            response.status = 404
			render flash.message
            return
        }
		response.status = 200
        render usuarioInstance as JSON
    }
}
