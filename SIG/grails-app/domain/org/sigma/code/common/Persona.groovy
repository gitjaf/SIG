package org.sigma.code.common

class Persona {

	int id
    String nombres
    String apellidos
   
    
    static constraints = {
    }
    
//   static belongsTo = [usuario : Usuario] 
    
    static mapping ={
        table 'sig_personas'
        version false
        
        id column: 'id_persona'
        nombres column: 'nombres'
        apellidos column: 'apellidos'
    }

    static halResource = {
        links(
            fetch: [mapping: "resources", trimId: true], 
            find: [mapping: "resources", trimId: true],
            create: [mapping: "resources", trimId: true],
            update: [mapping: "resource"],
            delete: [mapping: "resource"],
            deleteAll: [mapping: "resources", trimId: true]
        )
    }

    String getNombreCompleto() {
        return nombres + " " + apellidos
    }
}
