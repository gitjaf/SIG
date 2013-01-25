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

    	if (!clasificacionInstance) {
			return 404
        }

        try {
            clasificacionInstance.delete(flush: true)
			return 200
		}
        catch (DataIntegrityViolationException e) {
			return 500
	    }
        
    }
}
