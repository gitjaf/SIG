package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*
import grails.gorm.*
import org.codehaus.groovy.grails.web.json.JSONObject

class SeguimientoService {

    def saveSeguimiento(JSONObject json){

    	Tarea tarea = Tarea.get(json.idTarea as Long)
    	
    	Seguimiento seg = new Seguimiento()

    	seg.titulo = json.titulo
    	seg.fecha = json.fecha ? new Date(json.fecha) : null
    	seg.descripcion = json.descripcion ?: null
    	seg.responsable = Usuario.get(json.idUsuario as Long)

    	tarea.addToSeguimientos(seg);

    	if(tarea.save(flush: true)){
    		return tarea
    	}

    	return null
    }

}
