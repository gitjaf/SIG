package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*

class TareaService {

    Tarea nuevaTarea(JSON json) {

		Usuario usuario = Usuario.get(json.idUsuario);
		
		Tarea tarea = new Tarea(json)
		
		
    }


    List<Tarea> getTareas(Map params){
    	def query = Tarea.where {}
    	
    	if(params?.q){
    		query = query.where {
    			asunto =~ "%${params.q}%" || estado =~ "%${params.q}%" || prioridad =~ "%${params.q}%" || descripcion =~ "%${params.q}%"
    		}
    	}
    	
    	return query.list(sort: params?.sortBy)
    }

}
