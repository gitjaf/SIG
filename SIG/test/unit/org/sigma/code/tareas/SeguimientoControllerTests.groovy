package org.sigma.code.tareas



import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build
import org.sigma.code.common.*

@TestFor(SeguimientoController)
@Build([Seguimiento, Usuario])
class SeguimientoControllerTests {

	def populateValidParams(params) {
		params['borrado'] = true
		params['descripcion'] = 'valid_descripcion'
		params['fecha'] = '2012-10-20'
		params['titulo'] = 'valid_titulo'


		def responsable = Usuario.build()
		assert responsable.save() != null
		params['responsable'] = responsable

		assert params != null

	}

	void testIndex() {
		controller.index()
		assert "/seguimiento/list" == response.redirectedUrl
	}

	void testList() {
		request.method = "GET"

		def seguimiento = Seguimiento.build()

		assert seguimiento.save() != null

		response.format = "json"

		controller.list()

		assert response.status == 200
		assert response.json.size() == 1
	}

	void testSave() {
		request.method = "POST"
		response.format = "json"
		
		controller.save()

		assert response.status == 500
		response.reset()

		populateValidParams(params)
		params.idResponsable = params.responsable.id

		request.setJson(params as JSON)

		controller.save()

		assert response.status == 201
		assert response.json != null
	}

	void testShow() {
		request.method = "GET"
		controller.show()

		assert response.status == 404
		assert flash.message != null

		response.reset()
		response.format = "json"

		def seguimiento = Seguimiento.build()

		assert seguimiento.save() != null

		params.id = seguimiento.id

		controller.show()

		assert response.status == 200
		assert response.json != null
	}

	void testUpdateInexistente() {
		request.method = "PUT"
		controller.update()

		assert response.status == 404
		assert flash.message != null
	}

	void testUpdateInvalido(){
		request.method = "PUT"

		def seguimiento = Seguimiento.build()

		assert seguimiento.save() != null

		// Probar actualizar con parametros no-validos
		params.id = seguimiento.id
		params.borrado = ''
		params.dateCreated = ''
		params.fecha = ''
		params.lastUpdated = ''
		params.responsable = ''
		params.titulo = ''


		request.setJson(params as JSON)

		response.format = "json"
		controller.update()

		assert response.status == 500
		assert response.json != null
	}

	void testUpdateValido(){
		request.method  = "PUT"
		response.format = "json"

		populateValidParams(params)
		def seguimiento = Seguimiento.build()

		assert seguimiento.save() != null

		params.id = seguimiento.id

		request.setJson(params as JSON)

		controller.update()

		assert response.status == 200
		assert response.json != null
	}

	void testUpdateConcurrente(){
		request.method = "PUT"
		response.format = "json"

		populateValidParams(params)
		def seguimiento = Seguimiento.build()

		assert seguimiento.save() != null

		seguimiento.version = 1
		assert seguimiento.save() != null

		params.id = seguimiento.id
		params.version = -1
		request.setJson(params as JSON)

		controller.update()

		assert response.status == 409
		assert flash.message != null
	}

	void testDelete() {
		request.method = "DELETE"
		controller.delete()

		assert response.status == 404
		assert flash.message != null

		response.reset()

		def seguimiento = Seguimiento.build()

		assert seguimiento.save() != null

		params.id = seguimiento.id
		request.setJson(params as JSON)

		response.format = "json"
		controller.delete()

		assert Seguimiento.count() == 0
		assert Seguimiento.get(seguimiento.id) == null
		assert response.status == 200
		assert flash.message != null
	}
}
