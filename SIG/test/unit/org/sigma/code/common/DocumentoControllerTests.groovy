package org.sigma.code.common



import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build

@TestFor(DocumentoController)
@Build(Documento)
class DocumentoControllerTests {

	def populateValidParams(params) {
		params['borrado'] = true
		params['extension'] = 'valid_extension'
		params['nombre'] = 'valid_nombre'
		params['peso'] = 'valid_peso'
		params['ubicacion'] = 'valid_ubicacion'

		assert params != null

	}

	void testIndex() {
		controller.index()
		assert "/documento/list" == response.redirectedUrl
	}

	void testList() {
		request.method = "GET"

		def documento = Documento.build()

		assert documento.save() != null

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

		def documento = Documento.build()

		assert documento.save() != null

		params.id = documento.id

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

		def documento = Documento.build()

		assert documento.save() != null

		// Probar actualizar con parametros no-validos
		params.id = documento.id
		params.borrado = ''
		params.dateCreated = ''


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
		def documento = Documento.build()

		assert documento.save() != null

		params.id = documento.id

		request.setJson(params as JSON)

		controller.update()

		assert response.status == 200
		assert response.json != null
	}

	void testUpdateConcurrente(){
		request.method = "PUT"
		response.format = "json"

		populateValidParams(params)
		def documento = Documento.build()

		assert documento.save() != null

		documento.version = 1
		assert documento.save() != null

		params.id = documento.id
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

		def documento = Documento.build()

		assert documento.save() != null

		params.id = documento.id
		request.setJson(params as JSON)

		response.format = "json"
		controller.delete()

		assert Documento.count() == 0
		assert Documento.get(documento.id) == null
		assert response.status == 200
		assert flash.message != null
	}
}
