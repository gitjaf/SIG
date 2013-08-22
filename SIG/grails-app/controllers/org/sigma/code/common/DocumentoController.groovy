
package org.sigma.code.common

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON
import grails.plugins.springsecurity.Secured
import java.text.SimpleDateFormat

class DocumentoController {

    static allowedMethods = [show: ["GET", "POST"], save: "POST", update: "PUT", delete: "DELETE"]

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
		
		def documentoInstanceList = Documento.list()
		
		response.status = 200
		
		render documentoInstanceList as JSON
    }
    
    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def save() {
        def documentoInstance = new Documento(request.JSON)
		        
		if (!documentoInstance.save(flush: true)) {
			response.status = 500
			return
        }

		flash.message = message(code: 'default.created.message', args: [message(code: 'documento.label', default: 'Documento'), documentoInstance.id])
        response.status = 201
		render documentoInstance as JSON
    }

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def show() {
        def documentoInstance = Documento.get(params.id)
        if (!documentoInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'documento.label', default: 'Documento'), params.id])
            response.status = 404
			render flash.message
            return
        }
		response.status = 200
        render documentoInstance as JSON
    }

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def update() {
        def documentoInstance = Documento.get(params.id)
        if (!documentoInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'documento.label', default: 'Documento'), params.id])
            response.status = 404
			render flash.message
            return
        }

        if (request.JSON.version) {
            def version = request.JSON.version.toLong()
            if (documentoInstance.version > version) {
				flash.message = message(code: 'default.optimistic.locking.failure', args: [message(code: 'documento.label', default: 'Documento'), documentoInstance.id])
                response.status = 409
                return
            }
        }

        documentoInstance.properties = request.JSON
		
		
        if (!documentoInstance.save(flush: true)) {
            response.status = 500
			render documentoInstance as JSON
            return
        }

		flash.message = message(code: 'default.updated.message', args: [message(code: 'documento.label', default: 'Documento'), documentoInstance.id])
		response.status = 200
        render documentoInstance as JSON
    }

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def delete() {
        def documentoInstance = Documento.get(params.id)
        if (!documentoInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'documento.label', default: 'Documento'), params.id])
            response.status = 404
			render flash.message
            return
        }

        try {
            documentoInstance.delete(flush: true)
			flash.message = message(code: 'default.deleted.message', args: [message(code: 'documento.label', default: 'Documento'), params.id])
            response.status = 200
			render flash.message
        }
        catch (DataIntegrityViolationException e) {
			flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'documento.label', default: 'Documento'), params.id])
            response.status = 500
			render flash.message
        }
    }
}
