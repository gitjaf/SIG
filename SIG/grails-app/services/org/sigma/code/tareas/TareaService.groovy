package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*

class TareaService {

    Tarea nuevaTarea(JSON json) {

		Usuario usuario = Usuario.get(json.idUsuario);
		
		Tarea tarea = new Tarea(json)
		
		
    }
}
