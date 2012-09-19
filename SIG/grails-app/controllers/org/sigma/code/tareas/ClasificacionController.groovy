
package org.sigma.code.tareas

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON

import java.text.SimpleDateFormat

class ClasificacionController {

    static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
		
		def clasificacionInstanceList = Clasificacion.list()
		
		response.status = 200
		
		render clasificacionInstanceList as JSON
    }
    
    def save() {
        def clasificacionInstance = new Clasificacion(request.JSON)
		
		if (!clasificacionInstance.save(flush: true)) {
			response.status = 500
			return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), clasificacionInstance.id])
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
        def clasificacionInstance = Clasificacion.get(params.id)
        if (!clasificacionInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            response.status = 404
			render flash.message
            return
        }

        try {
            clasificacionInstance.delete(flush: true)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            response.status = 200
			render flash.message
        }
        catch (DataIntegrityViolationException e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'clasificacion.label', default: 'Clasificacion'), params.id])
            response.status = 500
			render flash.message
        }
    }
}
