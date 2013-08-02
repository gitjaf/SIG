package org.sigma.code.common

import org.sigma.code.tareas.Tarea

class Usuario {
	int id
	String username
	String password
	Persona persona
	
	static hasMany = [creadas : Tarea, asignadas : Tarea, seguidas : Tarea]
		
	static constraints = {
		creadas(cascade: 'all-delete-orphan')
		asignadas(cascade: 'all-delete-orphan')
		seguidas(cascade: 'all-delete-orphan')
	}
	
	static mapping ={
		table 'sig_usuarios'
		version false

		id column: 'id'
		username column: 'username'
		persona column: 'id_persona', joinTable: 'sig_persona', lazy: false
		creadas column: 'id_usuario', joinTable: 'sig_usuario_tareas_creadas'
		asignadas column: 'id_usuario', joinTable: 'sig_usuario_tareas_asignadas'
		seguidas column: 'id_usuario', joinTable: 'sig_usuario_tareas_seguidas'
	}
	
	def halRepresenter = [title: username, embedded: ["persona"]]

	String toString() {
		primeraEnMayuscula(persona.nombres) + " " + primeraEnMayuscula(persona.apellidos)
	}

	String primeraEnMayuscula(String cadena){
		cadena.toLowerCase().split(' ').collect{it.capitalize()}.join(' ')
	}


//	
//	boolean equals(other){
//		if(other?.id != this.id) { return false }
//	
//		return true
//	
//	}
//	
//	int hashCode() {
//		int result =  (id ? id.hashCode() : 0)
//		result = 31 * result + (username ? username.hashCode() : 0)
//		
//		return result
//	}
}
