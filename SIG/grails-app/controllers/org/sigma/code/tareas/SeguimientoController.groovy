
package org.sigma.code.tareas

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON
import org.sigma.code.common.*
import java.text.SimpleDateFormat

class SeguimientoController {

	static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

	def index() {
		redirect(action: "list", params: params)
	}

	def list() {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)

		def seguimientoInstanceList = Seguimiento.list()

		response.status = 200

		render seguimientoInstanceList as JSON
	}

	def save() {
		def seguimientoInstance = new Seguimiento(request.JSON)

		bindData(seguimientoInstance, request.JSON, ['fecha'])
		seguimientoInstance.fecha = request.JSON.fecha ? new SimpleDateFormat('yyyy-MM-dd').parse(request.JSON.fecha) : null

		seguimientoInstance.responsable = Usuario.get(request.JSON?.idResponsable)

		if (!seguimientoInstance.save(flush: true)) {
			response.status = 500
			return
		}

		flash.message = message(code: 'default.created.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), seguimientoInstance.id])
		response.status = 201
		render seguimientoInstance as JSON
	}

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

	def update() {
		def seguimientoInstance = Seguimiento.get(params.id)
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

		seguimientoInstance.properties = request.JSON

		bindData(seguimientoInstance, request.JSON, ['fecha'])
		seguimientoInstance.fecha = request.JSON.fecha ? new SimpleDateFormat('yyyy-MM-dd').parse(request.JSON.fecha) : null

		seguimientoInstance.responsable = (request.JSON?.idResponsable) ?  Usuario.get(request.JSON?.idResponsable) : seguimientoInstance.responsable

		if (!seguimientoInstance.save(flush: true)) {
			response.status = 500
			render seguimientoInstance as JSON
			return
		}

		flash.message = message(code: 'default.updated.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), seguimientoInstance.id])
		response.status = 200
		render seguimientoInstance as JSON
	}

	def delete() {
		def seguimientoInstance = Seguimiento.get(params.id)
		if (!seguimientoInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'seguimiento.label', default: 'Seguimiento'), params.id])
			response.status = 404
			render flash.message
			return
		}

		try {
			seguimientoInstance.delete(flush: true)
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
