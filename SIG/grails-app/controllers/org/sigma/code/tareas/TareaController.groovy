
package org.sigma.code.tareas

import org.codehaus.groovy.grails.web.mapping.LinkGenerator;
import org.h2.command.ddl.CreateLinkedTable;
import org.sigma.code.plugins.HalBuilderService;
import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON


import java.text.SimpleDateFormat

class TareaController {

	def halBuilderService
	
	def halCollectionBuilderService

	def tareaService
		
    static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        render(action: "list", params: params)
    }

    def list() {
    	def list = [:]
        
        if(params?.userId){
    		list = (halCollectionBuilderService.buildRepresentation(tareaService.getTareas(params, params.userId),
    		 request.getMethod(), params, [prepend:"/${params.userId}", append:""]))
    		response.status = 200
			
    	} else {
    		response.status = 401
    	}

		render list as JSON
    }
    
    def save() {
        def tareaInstance = tareaService.saveTarea(request.JSON)
		        
		if (!tareaInstance) {
			response.status = 500
			return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'tarea.label', default: 'Tarea'), tareaInstance.id])
        response.status = 201
        render halBuilderService.buildModel(tareaInstance) as JSON
    }

    def show() {
        def tareaInstance = halBuilderService.buildModel(Tarea.get(params.id))
		
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
        def tareaInstance = Tarea.get(params.id as Long)
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

        tareaInstance = tareaService.updateTarea(tareaInstance, request.JSON)
        if (!tareaInstance) {
            response.status = 500
			render tareaInstance as JSON
            return
        }

		flash.message = message(code: 'default.updated.message', args: [message(code: 'tarea.label', default: 'Tarea'), tareaInstance.id])
		response.status = 200
        render halBuilderService.buildModel(tareaInstance) as JSON
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
