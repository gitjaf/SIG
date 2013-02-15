package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*
import grails.gorm.*
import org.codehaus.groovy.grails.web.json.JSONObject

class TareaService {

    Comparator fechaInicio = [compare: {a, b -> 
            !a.fechaInicio && b.fechaInicio ? 1 : !b.fechaInicio && a.fechaInicio ? -1 : !a.fechaInicio &&
            !b.fechaInicio ? a.asunto.compareTo(b.asunto) : a.fechaInicio == b.fechaInicio ? a.asunto.compareTo(b.asunto) :
            b.fechaInicio.compareTo(a.fechaInicio)
        }] as Comparator

    Comparator fechaVencimiento = [compare: {a, b -> 
            !a.fechaVencimiento && b.fechaVencimiento ? 1 : !b.fechaVencimiento && a.fechaVencimiento ? -1 : !a.fechaVencimiento &&
            !b.fechaVencimiento ? a.asunto.compareTo(b.asunto) : a.fechaVencimiento == b.fechaVencimiento ? a.asunto.compareTo(b.asunto) : 
            a.fechaVencimiento.compareTo(b.fechaVencimiento)
        }] as Comparator


    Tarea saveTarea(JSONObject json) {

		Usuario usuario = Usuario.get(json.responsable)
		
		Tarea tarea = this.setValues(new Tarea(), json);

        usuario.addToCreadas(tarea)

        if(!tarea.save(flush: true)){
            return null
        }

        return tarea

    }

    Tarea updateTarea(Tarea tarea, JSONObject json){
        
        tarea = this.setValues(tarea, json)

        if(!tarea.save(flush: true)){
            return null
        }

        return tarea
    }

    def getTareas(int id){

        def usuario = Usuario.get(id)

        def tareas = (usuario.creadas + usuario.asignadas + usuario.seguidas).asList()
 
        return tareas

    }

    def getTareasCompletas(int id){
        return this.getTareas(id).findAll { tarea -> tarea?.estado == Tarea.ESTADO_CERRADA }
    }

    def getTareasBorradas(int id){
        return this.getTareas(id).findAll { tarea -> tarea?.borrado == true }
    }

    def getSubTareas(int id, lista){
        def usuario = Usuario.get(id)      
        return lista.findAll { tarea -> tarea?.tareaSuperior != null && !(tarea?.asignados.contains(usuario) ^ tarea?.seguidores.contains(usuario))}
    }

    def getTareas(Map params, String id){
        def tareas = this.getTareas(id as Integer).findAll {Tarea tarea -> 
            tarea.asunto =~ params?.q ||
            tarea.estado =~ params?.q ||
            tarea.prioridad =~ params?.q 
        }

        tareas = tareas - this.getSubTareas(id as Integer, tareas)

        def sortBy = params.sortBy ? params.sortBy : "fechaInicio"

        if(sortBy in ["fechaInicio", "fechaVencimiento"]){
            return tareas.sort(this."$sortBy")
        }

        return tareas.sort{it."$sortBy"}
    }

    Tarea setValues(Tarea tarea, JSONObject json){

        tarea.asunto = json.asunto

        tarea.estado = json.estado

        tarea.prioridad = json.prioridad

        tarea.descripcion = json.descripcion
        
        tarea.fechaInicio = json.fechaInicio ? Date.parse("dd/MM/yyyy", json.fechaInicio) : null 
        
        tarea.fechaVencimiento = json.fechaVencimiento ? Date.parse("dd/MM/yyyy", json.fechaVencimiento) : null 

        tarea.tareaSuperior = Tarea.get(json?.idTareaSuperior) 
 
        tarea.tipo = Clasificacion.get(json?.tipo?.id) 
 
        json?.idDocumentos?.each{ id -> tarea.addToDocumentos(Documento.get(id))} 

        json?.idSeguimientos?.each{ id -> tarea.addToSeguimientos(Seguimiento.get(id))} 

        json?.idTareasRelacionadas?.each{ id -> tarea.addToTareasRelacionadas(Tarea.get(id))}

        json?.asignados?.each { usuario -> tarea.addToAsignados(Usuario.get(usuario.id))}

        json?.seguidores?.each { usuario -> tarea.addToSeguidores(Usuario.get(usuario.id))}
        
        return tarea

    }
}
