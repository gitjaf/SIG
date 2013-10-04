package org.sigma.code.tareas


import org.sigma.code.common.Usuario

class Seguimiento implements Comparable{

    String titulo
    String descripcion
    Date fecha
    Boolean borrado = false
    Date dateCreated
    Date lastUpdated
    Usuario responsable
    
    static constraints = {
        titulo(nullable: false, blank: false, required: true)
        descripcion(nullable: true, blank: false)
        fecha(nullable: false, blank: false, required: true)
        responsable(nullable: false, blank: false, required: true)
    }
    
    static belongsTo = Tarea
    
    static mapping = {
        table 'sig_seguimientos'
		descripcion type:'text'
    }

    static halResource = {
        responsable embedded: true

        links(
            fetch: [mapping: "resources", trimId: true], 
            find: [mapping: "resources", trimId: true],
            create: [mapping: "resources", trimId: true],
            update: [mapping: "resource"],
            delete: [mapping: "resource"],
            deleteAll: [mapping: "resources", trimId: true]
        )
    }

    
    

    int compareTo(obj){
        obj.fecha.compareTo(fecha)
    }
}
