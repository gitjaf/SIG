
package org.sigma.code.tareas

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON
import org.sigma.code.common.*
import java.text.SimpleDateFormat
import grails.plugins.springsecurity.Secured

class SeguimientoController {

	def halBuilderService
	def halCollectionBuilderService

	def seguimientoService

	static allowedMethods = [show: "GET", find:"POST", save: "PUT", update: "PUT", delete: "DELETE"]

	@Secured(['ROLE_ADMIN', 'ROLE_USER'])
	def list() {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)

		def seguimientoInstanceList = Seguimiento.list()

		response.status = 200

		render seguimientoInstanceList as JSON
	}

	@Secured(['ROLE_ADMIN', 'ROLE_USER'])
	def save() {
		def seguimientoInstance = seguimientoService.saveSeguimiento(request.JSON)

		if (!seguimientoInstance) {
			response.status = 500
			return
		}

		flash.message = message(code: 'default.created.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), seguimientoInstance.id])
		response.status = 201
		render (halBuilderService.buildModel(seguimientoInstance) as JSON)
	}

	@Secured(['ROLE_ADMIN', 'ROLE_USER'])
	def show() {
		def seguimientoInstance = Seguimiento.get(params.id)
		if (!seguimientoInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), params.id])
			response.status = 404
			render flash.message
			return
		}
		response.status = 200
		render seguimientoInstance as JSON
	}

	@Secured(['ROLE_ADMIN', 'ROLE_USER'])
	def update() {
	
		def tareaInstance = Tarea.get(request.JSON.idTarea as Long)
		
		if (!tareaInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.idTarea])
			response.status = 404
			render flash.message
			return
		}

		def seguimientoInstance = Seguimiento.get(request.JSON.id as Long)

		if (!seguimientoInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), params.id])
			response.status = 404
			render flash.message
			return
		}

		if (request.JSON.version) {
			def version = request.JSON.version.toLong()
			if (seguimientoInstance.version > version) {
				flash.message = message(code: 'default.optimistic.locking.failure', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), seguimientoInstance.id])
				response.status = 409
				return
			}
		}

		seguimientoInstance = seguimientoService.updateSeguimiento(request.JSON, seguimientoInstance)

		if (!seguimientoInstance) {
			response.status = 500
			render seguimientoInstance as JSON
			return
		}

		flash.message = message(code: 'default.updated.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), seguimientoInstance.id])
		response.status = 200
		render halBuilderService.buildModel(seguimientoInstance) as JSON
	}

	@Secured(['ROLE_ADMIN', 'ROLE_USER'])
	def delete() {
		def tareaInstance = Tarea.get(params.idTarea as Long)
		def seguimientoInstance = Seguimiento.get(params.id as Long)

		if (!seguimientoInstance ) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), params.id])
			response.status = 404
			render flash.message
			return
		}

		if (!tareaInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.idTarea])
			response.status = 404
			render flash.message
			return
		}

		try {
			seguimientoService.deleteSeguimiento(tareaInstance, seguimientoInstance)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), params.id])
			response.status = 200
			render flash.message
		}

		catch (DataIntegrityViolationException e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), params.id])
			response.status = 500
			render flash.message
		}
	}
}
