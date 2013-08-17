package org.sigma.code.common

import org.apache.commons.lang.builder.HashCodeBuilder

class RolUsuario implements Serializable{

	Usuario usuario
	Rol rol

    static mapping = {
    	id composite: ['rol', 'usuario' ]
    	version false
    	table 'sig_rol_usuario'
    }

    boolean equals(other){
    	if(!other instanceof RolUsuario){
    		return false
    	}

    	other.usuario?.id == usuario?.id && 
    		other.rol?.id == rol?.id
    }

    int hashCode() {
    	def builder =  new HashCodeBuilder()
    	if (usuario) builder.append(usuario.id)
    	if (rol) builder.append(rol.id)
    	builder.toHashCode()
    }

    static RolUsuario get(long idUsuario, long idRol) {
    	find 'from RolUsuario where usuario.id = :idUsuario and rol.id = :idRol',
    		[idUsuario: idUsuario, idRol: idRol]
    }

    static RolUsuario create(Usuario usuario, Rol rol, boolean flush = false) {
    	new RolUsuario(usuario: usuario, rol: rol).save(flush: flush, insert: true)
    }

    static boolean remove(Usuario usuario, Rol rol, boolean flush = false) {
    	RolUsuario instance = RolUsuario.findByUsuarioAndRol(usuario, rol)
    	if (!instance) {
    		return false
    	}

    	instance.delete(flush: flush)
    	true
    }

    static void removeAll(Usuario usuario) {
    	executeUpdate('DELETE FROM RolUsuario WHERE usuario = :usuario', [usuario: usuario])
    }


}
