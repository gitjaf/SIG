package org.sigma.code.common



import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build

@TestFor(UsuarioController)
@Build(Usuario)
class UsuarioControllerTests {
   

    void testIndex() {
        controller.index()
        assert "/usuario/list" == response.redirectedUrl
    }

    void testList() {
		request.method = "GET"
		
        def usuario = Usuario.build()
		
		assert usuario.save() != null
		
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
		
        def usuario = Usuario.build()
		
		assert usuario.save() != null

        params.id = usuario.id

        controller.show()

        assert response.status == 200
		assert response.json != null
    }

    
}
