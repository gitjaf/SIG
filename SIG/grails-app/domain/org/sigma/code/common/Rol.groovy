package org.sigma.code.common

class Rol {

	String authority

	static mapping = {
		cache true
		table 'sig_rol'
	}

    static constraints = {
    	authority blank: false, unique: true
    }
}
