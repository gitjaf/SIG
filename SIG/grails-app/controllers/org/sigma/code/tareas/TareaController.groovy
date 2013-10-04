
package org.sigma.code.tareas

import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.h2.command.ddl.CreateLinkedTable
import org.sigma.code.plugins.HalBuilderService
import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON
import grails.plugins.springsecurity.Secured
import java.text.SimpleDateFormat
import org.codehaus.groovy.grails.commons.GrailsDomainClass

class TareaController {

	def halBuilderService
	
	def halCollectionBuilderService

	def tareaService
		
    static allowedMethods = [list: "GET", show: "GET", find:"POST", save: "PUT", update: "PUT", delete: "DELETE"]

    
    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def list() {
    	       
        def list = halBuilderService.buildModel(new Tarea())

        if(params?.userId){
            list = (halCollectionBuilderService.buildRepresentation(tareaService.getTareas(params, params.userId),
                request.getMethod(), params))
            response.status = 200
            
        } else {
            response.status = 401
        }
        
        list.data += [version: version]
        
        render list as JSON
    }
    
    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def find() {
        def list = [:]
        def version = grailsApplication.metadata['app.version']
        def json = request?.JSON
        if(json?.userId){
            list = (halCollectionBuilderService.buildRepresentation(tareaService.getTareas(json, json.userId as String),
                Tarea, json))
            response.status = 200
            
        } else {
            response.status = 401
        }
        
        list.data += [version: version]
        
        render list as JSON
    }

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
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

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
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

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
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

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def delete() {
        def tareaInstance = Tarea.get(params.id)
        if (!tareaInstance) {
			flash.message = message(code: 'default.not.found.message', args: [message(code: 'tarea.label', default: 'Tarea'), params.id])
            response.status = 404
			render flash.message
            return
        }

        response.status = tareaService.deleteTarea(tareaInstance)
        render 'ok';
        
    }

    @Secured(['ROLE_ADMIN', 'ROLE_USER'])
    def vaciarPapelera() {

        def respuesta = tareaService.vaciarPapelera(params.userId)

        response.status = respuesta.status

        render respuesta
    }
	
}
