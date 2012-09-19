package org.sigma.code.tareas



import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build

@TestFor(ClasificacionController)
@Build(Clasificacion)
class ClasificacionControllerTests {

	def populateValidParams(params) {
		params['borrado'] = true
		params['descripcion'] = 'valid_descripcion'
		params['nombre'] = 'valid_nombre'

		assert params != null

	}

	void testIndex() {
		controller.index()
		assert "/clasificacion/list" == response.redirectedUrl
	}

	void testList() {
		request.method = "GET"

		def clasificacion = Clasificacion.build()

		assert clasificacion.save() != null

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

		def clasificacion = Clasificacion.build()

		assert clasificacion.save() != null

		params.id = clasificacion.id

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

		def clasificacion = Clasificacion.build()

		assert clasificacion.save() != null

		// Probar actualizar con parametros no-validos
		params.id = clasificacion.id
		params.nombre = ''


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
		def clasificacion = Clasificacion.build()

		assert clasificacion.save() != null

		params.id = clasificacion.id

		request.setJson(params as JSON)

		controller.update()

		assert response.status == 200
		assert response.json != null
	}

	void testUpdateConcurrente(){
		request.method = "PUT"
		response.format = "json"

		populateValidParams(params)
		def clasificacion = Clasificacion.build()

		assert clasificacion.save() != null

		clasificacion.version = 1
		assert clasificacion.save() != null

		params.id = clasificacion.id
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

		def clasificacion = Clasificacion.build()

		assert clasificacion.save() != null

		params.id = clasificacion.id
		request.setJson(params as JSON)

		response.format = "json"
		controller.delete()

		assert Clasificacion.count() == 0
		assert Clasificacion.get(clasificacion.id) == null
		assert response.status == 200
		assert flash.message != null
	}
}
