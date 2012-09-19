
package org.sigma.code.common

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON



class PersonaController {

    static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
		
		def personaInstanceList = Persona.list()
		
		response.status = 200
		
		render personaInstanceList as JSON
    }
    

    def show() {
        def personaInstance = Persona.get(params.id)
        if (!personaInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'persona.label', default: 'Persona'), params.id])
            response.status = 404
			render flash.message
            return
        }
		response.status = 200
        render personaInstance as JSON
    }

}
