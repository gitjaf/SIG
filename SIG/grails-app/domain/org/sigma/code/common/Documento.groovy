package org.sigma.code.common


import org.sigma.code.tareas.Tarea

class Documento {

	String nombre
	String ubicacion
	String extension
	String peso
	Date dateCreated
	Boolean borrado = false

	static constraints = {
		nombre(nullable: false)
		ubicacion(nullable: false)
		extension(nullable: false)
		peso(nullable: false)
	}
	
	// Marco la relacion como unidireccional
	static belongsTo =  Tarea
	
	static mapping = {
		table 'sig_documentos'
		
	}
}
