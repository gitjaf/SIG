package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*
import grails.gorm.*
import org.codehaus.groovy.grails.web.json.JSONObject
import org.springframework.dao.DataIntegrityViolationException

class SeguimientoService {

    def saveSeguimiento(JSONObject json){

    	Tarea tarea = Tarea.get(json.idTarea as Long)
    	
    	Seguimiento seg = new Seguimiento()

    	setValues(seg, json)
      
    	tarea.addToSeguimientos(seg)
        
    	if(tarea.save(flush: true)){
    		return seg
    	}

    	return null
    }

    def updateSeguimiento(JSONObject json, Seguimiento seg){
        
        setValues(seg, json)

        if(seg.save(flush: true)){
            return seg
        }

        return null
    }

    def deleteSeguimiento(Tarea t, Seguimiento seg) throws DataIntegrityViolationException{
        t.removeFromSeguimientos(seg)
        seg.delete(flush: true)
    }

    protected setValues(Seguimiento seg, JSONObject json){
        seg.titulo = json.titulo
        seg.fecha = json.fecha ? Date.parse("dd/MM/yyyy", json.fecha) : null 
        seg.descripcion = json.descripcion ?: null
        seg.responsable = Usuario.get(json.idUsuario as Long)
       
    }

}
