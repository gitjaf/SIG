package org.sigma.code.common

class Persona {

	int id
    String nombres
    String apellidos
   
    
    static constraints = {
    }
    
//   static belongsTo = [usuario : Usuario] 
    
    static mapping ={
        table 'sig_persona'
        version false
        
        id column: 'id_persona'
        nombres column: 'nombres'
        apellidos column: 'apellidos'
    }
}
