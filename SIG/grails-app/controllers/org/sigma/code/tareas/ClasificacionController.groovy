
package org.sigma.code.tareas


import grails.converters.JSON

import java.text.SimpleDateFormat

class ClasificacionController {

    static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

    def halBuilderService

    def clasificacionService

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
		
		def clasificacionInstanceList = halBuilderService.buildModelList(Clasificacion.list())
		
		response.status = 200
		
		render clasificacionInstanceList as JSON
    }
    
    def save() {
        def clasificacionInstance = clasificacionService.crearClasificacion(request.JSON)
		
		if (!clasificacionInstance) {
			response.status = 500
			return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), clasificacionInstance.id])
        clasificacionInstance = halBuilderService.buildModel(clasificacionInstance)
        
        response.status = 201
        
		render clasificacionInstance as JSON
    }

    def show() {
        def clasificacionInstance = Clasificacion.get(params.id)
        if (!clasificacionInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            response.status = 404
			render flash.message
            return
        }
		response.status = 200
        render clasificacionInstance as JSON
    }

    def update() {
        def clasificacionInstance = Clasificacion.get(params.id)
        if (!clasificacionInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            response.status = 404
			render flash.message
            return
        }

        if (request.JSON.version) {
            def version = request.JSON.version.toLong()
            if (clasificacionInstance.version > version) {
				flash.message = message(code: 'default.optimistic.locking.failure', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), clasificacionInstance.id])
                response.status = 409
                return
            }
        }

        clasificacionInstance.properties = request.JSON
		
        if (!clasificacionInstance.save(flush: true)) {
            response.status = 500
			render clasificacionInstance as JSON
            return
        }

		flash.message = message(code: 'default.updated.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), clasificacionInstance.id])
		response.status = 200
        render clasificacionInstance as JSON
    }

    def delete() {
       
        response.status = clasificacionService.borrarClasificacion(params.id as Integer)
        
        flash.message = 
            response.status == 404 ? 
            message(code: 'default.not.found.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id]) :
                response.status == 200 ? 
                message(code: 'default.deleted.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id]) :
                message(code: 'default.not.deleted.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])

        render flash.message
        
    }
}
