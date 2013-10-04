package org.sigma.code.tareas

class Clasificacion {

    String nombre
    String descripcion
    Date dateCreated
    Date lastUpdated
    Boolean borrado = false
 
    
    
    static constraints = {
        nombre(nullable: false, blank: false, required: true)
        descripcion(nullable: true, blank: false)
        borrado(nullable: true, blank: false)
    }
    
    static mapping = {
        table 'sig_tipos_tarea'
    }

    static halResource = {
        links(
            fetch: [mapping: "resources", trimId: true, collection: true], 
            find: [mapping: "resources", trimId: true, collection: true],
            create: [mapping: "resources", trimId: true, collection: true],
            update: [mapping: "resource"],
            delete: [mapping: "resource"],
        )
    }
    
    String toString(){
        nombre
    }

    
}
