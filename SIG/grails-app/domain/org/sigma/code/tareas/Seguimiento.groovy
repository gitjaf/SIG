package org.sigma.code.tareas


import org.sigma.code.common.Usuario

class Seguimiento {

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
        table 'sig_grv_tar_seguimiento'
		
		descripcion type:'text'
    }
}
