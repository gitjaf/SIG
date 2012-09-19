package org.sigma.code.tareas



import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build

@TestFor(TareaController)
@Build([Tarea, Clasificacion])
class TareaControllerTests {

    def populateValidParams(params) {
	    	 params['asunto'] = 'valid_asunto'
  	 	 params['borrado'] = true 
//  		 params['dateCreated'] = '2012-10-20' 
  		 params['descripcion'] = 'valid_descripcion'
  	 	 params['estado'] = 'valid_estado'
  	 	 params['fechaInicio'] = '2012-10-20' 
  		 params['fechaVencimiento'] = '2012-10-20' 
//  		 params['lastUpdated'] = '2012-10-20' 
  		 params['prioridad'] = 'valid_prioridad'
  	 
  
  		 def tareaSuperior = Tarea.build()
	 	 assert tareaSuperior.save() != null
	 	 params['tareaSuperior'] = tareaSuperior
	 	 def tipo = Clasificacion.build()
	 	 assert tipo.save() != null
	 	 params['tipo'] = tipo

	  assert params != null
	  
    }

    void testIndex() {
        controller.index()
        assert "/tarea/list" == response.redirectedUrl
    }

    void testList() {
		request.method = "GET"
		
        def tarea = Tarea.build()
		
		assert tarea.save() != null
		
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
		params.idTareaSuperior = params.tareaSuperior.id
	 	params.idTipo = params.tipo.id

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
		
        def tarea = Tarea.build()
		
		assert tarea.save() != null

        params.id = tarea.id

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

        def tarea = Tarea.build()
		
		assert tarea.save() != null

        // Probar actualizar con parametros no-validos
        params.id = tarea.id
        params.asunto = '' 
 	 	params.borrado = '' 
 	 	params.dateCreated = '' 
 	 	params.lastUpdated = '' 
 	

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
        def tarea = Tarea.build()
		
		assert tarea.save() != null
		
		params.id = tarea.id
		
		request.setJson(params as JSON)
		
		controller.update()

        assert response.status == 200
		assert response.json != null
	}
	
	void testUpdateConcurrente(){
		request.method = "PUT"
		response.format = "json"
		
        populateValidParams(params)
		def tarea = Tarea.build()
		
		assert tarea.save() != null
		
		tarea.version = 1
		assert tarea.save() != null
		
        params.id = tarea.id
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

        def tarea = Tarea.build()
		
		assert tarea.save() != null

        params.id = tarea.id
		request.setJson(params as JSON)
		
		response.format = "json"
        controller.delete()

        assert Tarea.count() == 0
        assert Tarea.get(tarea.id) == null
        assert response.status == 200
		assert flash.message != null
    }
}
