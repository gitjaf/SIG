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
    
    String toString(){
        nombre
    }

    def halRepresenter = [title: nombre, embedded: []]
}
