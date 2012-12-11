package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*
import grails.gorm.*

class TareaService {

    Tarea nuevaTarea(JSON json) {

		Usuario usuario = Usuario.get(json.idUsuario);
		
		Tarea tarea = new Tarea(json)
		
    }

    def getTareas(int id){

        def usuario = Usuario.get(id)

        def tareas = (usuario.creadas + usuario.asignadas + usuario.seguidas).asList()

        // Encuentro todas las Tareas que estan en la papelera
        def tareasBorradas = tareas.findAll { tarea -> tarea.borrado == true }
        
        // Encuentro todas las Tareas que estan completadas
        def tareasCompletas = tareas.findAll { tarea -> tarea?.estado == "Cerrada" }
        
        // Encuentro todas las Tareas que son subtarea de otra
        def subtareas = tareas.findAll { tarea -> tarea?.tareaSuperior != null && !(tarea?.asignados.contains(usuario) ^ tarea?.seguidores.contains(usuario))}
        
        // Filtro las tareas a mostrar
        tareas = ((tareas - tareasBorradas) - tareasCompletas) - subtareas

        
        return tareas

    }

    def getTareas(Map params, String id){
        return this.getTareas(id as Integer).findAll {Tarea tarea -> tarea.asunto =~ params?.q ||
         tarea.estado =~ params?.q || tarea.prioridad =~ params?.q }
    }

}
