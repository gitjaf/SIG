
package org.sigma.code.tareas

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON

import java.text.SimpleDateFormat

class TareaController {

    static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
		
		def tareaInstanceList = Tarea.list()
		
		response.status = 200
		
		render tareaInstanceList as JSON
    }
    
    def save() {
        def tareaInstance = new Tarea()

		 bindData(tareaInstance, request.JSON, ['fechaInicio', 'fechaVencimiento']) 
		 
		 tareaInstance.fechaInicio = request.JSON.fechaInicio ? new SimpleDateFormat('yyyy-MM-dd').parse(request.JSON.fechaInicio) : null 
		 tareaInstance.fechaVencimiento = request.JSON.fechaVencimiento ? new SimpleDateFormat('yyyy-MM-dd').parse(request.JSON.fechaVencimiento) : null 

	 	 tareaInstance.tareaSuperior = Tarea.get(request.JSON?.idTareaSuperior) 
 
	 	 tareaInstance.tipo = Clasificacion.get(request.JSON?.idTipo) 
 
	 	 request.JSON?.idDocumentos?.each{ id -> tareaInstance.addToDocumentos(Documento.get(id))} 

	 	 request.JSON?.idSeguimientos?.each{ id -> tareaInstance.addToSeguimientos(Seguimiento.get(id))} 

	 	 request.JSON?.idTareasRelacionadas?.each{ id -> tareaInstance.addToTareasRelacionadas(Tarea.get(id))} 

		        
		if (!tareaInstance.save(flush: true)) {
			response.status = 500
			return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'tarea.label', default: 'Tarea'), tareaInstance.id])
        response.status = 201
		render tareaInstance as JSON
    }

    def show() {
        def tareaInstance = Tarea.get(params.id)
        if (!tareaInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.id])
            response.status = 404
			render flash.message
            return
        }
		response.status = 200
        render tareaInstance as JSON
    }

    def update() {
        def tareaInstance = Tarea.get(params.id)
        if (!tareaInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.id])
            response.status = 404
			render flash.message
            return
        }

        if (request.JSON.version) {
            def version = request.JSON.version.toLong()
            if (tareaInstance.version > version) {
				flash.message = message(code: 'default.optimistic.locking.failure', args: [message(code: 'tarea.label', default: 'Tarea'), tareaInstance.id])
                response.status = 409
                return
            }
        }

        tareaInstance.properties = request.JSON
		
		 bindData(tareaInstance, request.JSON, ['fechaInicio', 'fechaVencimiento']) 

		 tareaInstance.fechaInicio = request.JSON.fechaInicio ? new SimpleDateFormat('yyyy-MM-dd').parse(request.JSON.fechaInicio) : null 
	 	 tareaInstance.fechaVencimiento = request.JSON.fechaVencimiento ? new SimpleDateFormat('yyyy-MM-dd').parse(request.JSON.fechaVencimiento) : null 
	 
	 	 tareaInstance.tareaSuperior = (request.JSON?.idTareaSuperior) ?  Tarea.get(request.JSON?.idTareaSuperior) : tareaInstance.tareaSuperior 
 
	 	 tareaInstance.tipo = (request.JSON?.idTipo) ?  Clasificacion.get(request.JSON?.idTipo) : tareaInstance.tipo 
 
 	 	 if(request.JSON?.idDocumentos || request.JSON?.idDocumentos?.isEmpty()){ 
	 	 	 tareaInstance.documentos?.clear() 
	 	 	 request.JSON.idDocumentos.each{id -> tareaInstance.addToDocumentos(Documento.get(id))} 
	 	} 

 	 	 if(request.JSON?.idSeguimientos || request.JSON?.idSeguimientos?.isEmpty()){ 
	 	 	 tareaInstance.seguimientos?.clear() 
	 	 	 request.JSON.idSeguimientos.each{id -> tareaInstance.addToSeguimientos(Seguimiento.get(id))} 
	 	} 

 	 	 if(request.JSON?.idTareasRelacionadas || request.JSON?.idTareasRelacionadas?.isEmpty()){ 
	 	 	 tareaInstance.tareasRelacionadas?.clear() 
	 	 	 request.JSON.idTareasRelacionadas.each{id -> tareaInstance.addToTareasRelacionadas(Tarea.get(id))} 
	 	} 

		
        if (!tareaInstance.save(flush: true)) {
            response.status = 500
			render tareaInstance as JSON
            return
        }

		flash.message = message(code: 'default.updated.message', args: [message(code: 'tarea.label', default: 'Tarea'), tareaInstance.id])
		response.status = 200
        render tareaInstance as JSON
    }

    def delete() {
        def tareaInstance = Tarea.get(params.id)
        if (!tareaInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.id])
            response.status = 404
			render flash.message
            return
        }

        try {
            tareaInstance.delete(flush: true)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.id])
            response.status = 200
			render flash.message
        }
        catch (DataIntegrityViolationException e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.id])
            response.status = 500
			render flash.message
        }
    }
}
