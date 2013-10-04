package org.sigma.code.common

import org.sigma.code.tareas.Tarea

class Usuario {
	
	transient springSecurityService

	int id
	String username
	String password
	String email
	boolean enabled
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	Persona persona
	
	static hasMany = [creadas : Tarea, asignadas : Tarea, seguidas : Tarea]
		
	static constraints = {
		username blank: false, unique: true
		password blank: false
		email nullable: true, blank: true
		creadas(cascade: 'all-delete-orphan')
		asignadas(cascade: 'all-delete-orphan')
		seguidas(cascade: 'all-delete-orphan')
	}
	
	static mapping ={
		table 'sig_usuarios'
		version false

		id column: 'id'
		username column: 'username'
		password column: '`password`'
		persona column: 'id_persona', joinTable: 'sig_persona', lazy: false
		creadas column: 'id_usuario', joinTable: 'sig_usuario_tareas_creadas'
		asignadas column: 'id_usuario', joinTable: 'sig_usuario_tareas_asignadas'
		seguidas column: 'id_usuario', joinTable: 'sig_usuario_tareas_seguidas'
	}
	
	static halResource = {
		persona embedded: true
		creadas embedded: false
		asignadas embedded: false
		seguidas embedded: false

		links(
			appRoot: [mapping: "resources", controller: "Tarea", trimId: true],
			createTarea: [mapping: "resources", controller: "Tarea", trimId: true],
			fetch: [mapping: "resources", trimId: true], 
			find: [mapping: "resources", trimId: true],
			create: [mapping: "resources", trimId: true],
			update: [mapping: "resource"],
			delete: [mapping: "resource"],
			deleteAll: [mapping: "resources", trimId: true],
			createClasificacion: [mapping: "resources", trimId: true, controller: "Clasificacion", role:["ROLE_ADMIN"]]
		)
	}

	Set<Rol>getAuthorities(){
		RolUsuario.findAllByUsuario(this).collect {it.rol} as Set
	}


	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if(isDirty('password')){
			encodePassword()
		}
	}

	protected void encodePassword(){
		password = springSecurityService.encodePassword(password)
	}
	String toString() {
		primeraEnMayuscula(persona.nombres) + " " + primeraEnMayuscula(persona.apellidos)
	}

	String primeraEnMayuscula(String cadena){
		cadena.toLowerCase().split(' ').collect{it.capitalize()}.join(' ')
	}

	


}
