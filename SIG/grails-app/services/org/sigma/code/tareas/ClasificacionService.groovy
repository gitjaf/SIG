package org.sigma.code.tareas

import org.codehaus.groovy.grails.web.json.JSONObject
import org.springframework.dao.DataIntegrityViolationException

class ClasificacionService {

    def crearClasificacion(JSONObject json){
    	Clasificacion tipo = new Clasificacion(json)

    	if(!tipo.save(flush: true)){
    		return null
    	}

    	return tipo
    }

    def borrarClasificacion(int id){

    	def clasificacionInstance = Clasificacion.get(id)
    	def message
    	def statusCode


    	if (!clasificacionInstance) {
			message = message(code: 'default.not.found.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            statusCode = 404
        }

        try {
            clasificacionInstance.delete(flush: true)
			message = message(code: 'default.deleted.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            statusCode = 200
		}
        catch (DataIntegrityViolationException e) {
			message = message(code: 'default.not.deleted.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            statusCode = 500
	    }
        finally{
        	return [message: message, statusCode: statusCode]
        
        }
    }
}
