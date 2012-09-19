package org.sigma.code.common



import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build

@TestFor(PersonaController)
@Build(Persona)
class PersonaControllerTests {

    def populateValidParams(params) {
		params['apellidos'] = 'valid_apellidos'
		params['nombres'] = 'valid_nombres'

		assert params != null
	  
    }

    void testIndex() {
        controller.index()
        assert "/persona/list" == response.redirectedUrl
    }

    void testList() {
		request.method = "GET"
		
        def persona = Persona.build()
		
		assert persona.save() != null
		
		response.format = "json"
		
		controller.list()
		
		assert response.status == 200
		assert response.json.size() == 1
    }


    void testShow() {
		request.method = "GET"
		controller.show()

        assert response.status == 404
        assert flash.message != null

		response.reset()
		response.format = "json"
		
        def persona = Persona.build()
		
		assert persona.save() != null

        params.id = persona.id

        controller.show()

        assert response.status == 200
		assert response.json != null
    }

}
