<%=packageName ? "package ${packageName}\n\n" : ''%>

import org.junit.*
import grails.test.mixin.*
import grails.converters.JSON
import grails.buildtestdata.mixin.Build

@TestFor(${className}Controller)
@Build(${className})
class ${className}ControllerTests {

    def populateValidParams(params) {
	    <%
			def cantFechas = 0
			domainClass.properties.each{
				print ((it.type == String.class)? "\t params['${it.name}'] = 'valid_${it.name}'\n  \t " :
				(it.type == Boolean.class)? "\t params['${it.name}'] = ${true} \n  \t" : 
				(it.type == Date.class)? "\t params['${it.name}'] = '2012-10-20' \n  \t" :
				(it.type == Long.class & it.name != "id" & it.name != "version")? "\t params['${it.name}'] = ${1} \n  \t " :
				(it.type == Integer.class & it.name != "id" & it.name != "version")? "\t params['${it.name}'] = ${1} \n  \t " :
				(it.type == Double.class & it.name != "id" & it.name != "version")? "\t params['${it.name}'] = ${1.0d} \n  \t " :
				(it.type == Float.class & it.name != "id" & it.name != "version")? "\t params['${it.name}'] = ${1.0f} \n  \t " : "")
		}%>
  
  		<%
		  	domainClass.persistentProperties.findAll {it.isOneToOne() || it.isManyToOne()}.each{
			  println "\t \t def ${it.name} = ${it.type.getSimpleName()}.build()"
			  println "\t \t assert ${it.name}.save() != null"
			  println "\t \t params['${it.name}'] = ${it.name}"
			}
		  %>
	  assert params != null
	  
    }

    void testIndex() {
        controller.index()
        assert "/$propertyName/list" == response.redirectedUrl
    }

    void testList() {
		request.method = "GET"
		
        def ${propertyName} = ${className}.build()
		
		assert ${propertyName}.save() != null
		
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
		<% 
			domainClass.persistentProperties.findAll {it.isOneToOne() || it.isManyToOne()}.each{
				println "\t \t params.id${it.name.capitalize()} = params.${it.name}.id"
			}
		%>
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
		
        def ${propertyName} = ${className}.build()
		
		assert ${propertyName}.save() != null

        params.id = ${propertyName}.id

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

        def ${propertyName} = ${className}.build()
		
		assert ${propertyName}.save() != null

        // Probar actualizar con parametros no-validos
        params.id = ${propertyName}.id
        <%domainClass.properties.each{
			print((!it.optional & it.name != "id" & it.name != "version") ? " \t \t params.${it.name} = '' \n \t" : "" )
		}%>

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
        def ${propertyName} = ${className}.build()
		
		assert ${propertyName}.save() != null
		
		params.id = ${propertyName}.id
		
		request.setJson(params as JSON)
		
		controller.update()

        assert response.status == 200
		assert response.json != null
	}
	
	void testUpdateConcurrente(){
		request.method = "PUT"
		response.format = "json"
		
        populateValidParams(params)
		def ${propertyName} = ${className}.build()
		
		assert ${propertyName}.save() != null
		
		${propertyName}.version = 1
		assert ${propertyName}.save() != null
		
        params.id = ${propertyName}.id
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

        def ${propertyName} = ${className}.build()
		
		assert ${propertyName}.save() != null

        params.id = ${propertyName}.id
		request.setJson(params as JSON)
		
		response.format = "json"
        controller.delete()

        assert ${className}.count() == 0
        assert ${className}.get(${propertyName}.id) == null
        assert response.status == 200
		assert flash.message != null
    }
}
