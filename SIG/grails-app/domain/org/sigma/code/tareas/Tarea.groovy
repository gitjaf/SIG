package org.sigma.code.tareas

import groovy.transform.ToString;

import org.sigma.code.common.Documento
import org.sigma.code.common.Usuario



class Tarea {
	public final static ESTADO_CERRADA = "Cerrada"
	public final static ESTADO_NUEVA = "Nueva"
	public final static ESTADO_EN_CURSO = "En Curso"
	public final static ESTADO_TERMINADA = "Terminada"
	
	public final static PRIORIDAD_ALTA = "Alta"
	public final static PRIORIDAD_NORMAL = "Normal"
	public final static PRIORIDAD_BAJA = "Baja"
	public final static PRIORIDAD_NULA = "Sin Apuro"

	String asunto
	String descripcion
	Date fechaInicio
	Date fechaVencimiento
	Date fechaRevision
	String estado
	String prioridad
	Tarea tareaSuperior
	Clasificacion tipo
	Date dateCreated
	Date lastUpdated
	Boolean borrado = false
	Usuario responsable

	SortedSet seguimientos

	static hasMany = [tareasRelacionadas : Tarea, seguimientos : Seguimiento, documentos : Documento,
											asignados : Usuario, seguidores : Usuario]

	static mappedBy = [asignados: "asignadas", seguidores: "seguidas", responsable: "creadas"]
	
	static belongsTo = Usuario
	
	static constraints = {
		asunto(nullable: false, blank: false, required: true)
		descripcion(nullable: true, blank: true)
		fechaInicio(nullable: true, blank: false)
		fechaVencimiento(nullable: true, blank: false)
		fechaRevision(nullable: true, blank: false)
		tipo(nullable: true, blank: false)
		estado(nullable: true)
		prioridad(nullable: true)
		tareaSuperior(nullable: true)
		tareasRelacionadas(nullable: true, cascade: 'all-delete-orphan')
		borrado(nullable: false, blank: false, required: true)			
	}
	
		
	static mapping = {
		table 'sig_tareas'
   
		asignados column: 'id_tarea', joinTable: 'sig_usuario_tareas_asignadas'
		seguidores column: 'id_tarea', joinTable: 'sig_usuario_tareas_seguidas'
		documentos column: 'id_tarea', joinTable: 'sig_tareas_documentos'
		seguimientos column: 'id_tarea', joinTable: 'sig_tareas_seguimientos'
		descripcion type: 'text'
		
		tipo lazy: false
			   
	}
	
	static halResource = {
		tipo embedded: true
		tareasRelacionadas embedded: true
		asignados embedded: true
		seguidores embedded: true
		responsable embedded: true
		seguimientos embedded: true

		links(
			fetch: [mapping: "resources", trimId: true, collection: true], 
			find: [mapping: "resources", trimId: true, collection: true],
			create: [mapping: "resources", trimId: true, collection: true],
			update: [mapping: "resource"],
			delete: [mapping: "resource"],
			addSeguimiento: [mapping:"resources", trimId: true, controller: "Seguimiento"],
			deleteAll: [mapping: "resources", trimId: true, collection: true]
		)
	}
   
	public String getAsunto(){
		return asunto
	}
}
