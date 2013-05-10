package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*
import grails.gorm.*
import org.codehaus.groovy.grails.web.json.JSONObject
import org.springframework.dao.DataIntegrityViolationException

class TareaService {

    Comparator fechaInicio = [compare: {a, b -> 
            !a.fechaInicio && b.fechaInicio ? 1 : !b.fechaInicio && a.fechaInicio ? -1 : !a.fechaInicio &&
            !b.fechaInicio ? a.asunto.compareTo(b.asunto) : a.fechaInicio == b.fechaInicio ? a.asunto.compareTo(b.asunto) :
            b.fechaInicio.compareTo(a.fechaInicio)
        }] as Comparator

    Comparator fechaVencimiento = [compare: {a, b -> 
            !a.fechaVencimiento && b.fechaVencimiento ? 1 : !b.fechaVencimiento && a.fechaVencimiento ? -1 : !a.fechaVencimiento &&
            !b.fechaVencimiento ? a.asunto.compareTo(b.asunto) : a.fechaVencimiento == b.fechaVencimiento ? a.asunto.compareTo(b.asunto) : 
            a.fechaVencimiento.compareTo(b.fechaVencimiento)
        }] as Comparator


    Tarea saveTarea(JSONObject json) {

		Usuario usuario = Usuario.get(json.responsable)
		
		Tarea tarea = this.setValues(new Tarea(), json);

        usuario.addToCreadas(tarea)

        if(!tarea.save(flush: true)){
            return null
        }

        return tarea

    }

    Tarea updateTarea(Tarea tarea, JSONObject json){
                
        tarea = this.setValues(tarea, json)

        if(!tarea.save(flush: true)){
            return null
        }

        return tarea
    }

    def deleteTarea(Tarea tarea){
        try {
            clearValues(tarea)
            tarea.discard()
            Tarea.withTransaction { status ->
                Tarea t = Tarea.load(tarea.id)
                t.delete()
                status.flush()
            }
            return 200
        }
        catch (DataIntegrityViolationException e) {
            return 500
        }
    }

    def vaciarPapelera(String id){
        def usuario = Usuario.get(id as Integer)
        def tareas = Tarea.executeQuery("from Tarea t where t.responsable = :usuario and t.borrado = true", [usuario: usuario])

        def respuesta = [:]
                
        tareas.each{ it ->
            def t = Tarea.get(it.id)
            clearValues(t)
        }

        tareas*.discard()
        Tarea.withTransaction { status ->
            tareas.each{
                Tarea tarea = Tarea.load(it.id)
                tarea.delete()
            }
            status.flush()
        }

        respuesta.status = 200
        return respuesta
    }


    def getTareas(int id){

        def usuario = Usuario.get(id)

        def tareas = (usuario.creadas + usuario.asignadas + usuario.seguidas).asList()
 
        return tareas

    }

    def getTareasCompletas(int id){
        return this.getTareas(id).findAll { tarea -> tarea?.estado == Tarea.ESTADO_CERRADA }
    }

    def getTareasBorradas(int id){
        return this.getTareas(id).findAll { tarea -> tarea?.borrado == true }
    }


    def getTareas(Map params, String idUsuario){
        if(params.tareaSuperior){
            return this.getSubTareas(params.tareaSuperior as Integer, params?.sortBy)
        }

        def usuario = Usuario.get(idUsuario as Integer)

        def query = "from org.sigma.code.tareas.Tarea as t where "

        def borrado = false

        def superior = " and t.tareaSuperior is null "

        def tareas = []

        def parametros = [usuario: usuario]

        if(usuario){
            switch(params.filtro) {
                case "propias":
                    query += this.getTareasPropias()
                break

                case "asignadas":
                    query += this.getTareasAsignadas()
                break

                case "seguidas":
                    query += this.getTareasSeguidas()
                break

                case "papelera":
                    borrado = true
                    superior = ""

                default:
                    query += this.getTareasTodas()                   
            }


            if (params.q) {
                query += this.getBusquedaTareas(params.q, parametros)
            }
                    
            query += " and ( t.borrado = :borrado ) " + superior +  " order by t.${params.sortBy}"
            
            parametros['borrado'] = borrado 
                      
            tareas = Tarea.executeQuery(query, parametros)

        } 

        if(!superior){
            tareas = tareas.findAll{ it -> 
                !it.tareaSuperior || it.tareaSuperior.borrado == false
            }
        }
        return tareas
    }

    def getBusquedaTareas(String busqueda, Map parametros){
        parametros['search'] = "%" + busqueda + "%" 
        return " and ( lower(t.asunto) like lower(:search) or " +
            " lower(t.estado) like lower(:search) or " +
            " lower(t.prioridad) like lower(:search) ) " 
    }

    def getTareasPropias(){
        return " t.responsable = :usuario "
    }

    protected getTareasAsignadas(){
        return " :usuario in elements(t.asignados) "
    }

    protected getTareasSeguidas(){
        return " :usuario in elements(t.seguidores) "
    }

    protected getTareasTodas(){
        def query = "( " + this.getTareasPropias() + " or " +
                    this.getTareasAsignadas() + " or " + 
                    this.getTareasSeguidas() + " ) "
        
        return query
    }


    protected getSubTareas(int id, String orden){
        def tarea = Tarea.get(id)      
        return Tarea.findAllByTareaSuperior(tarea, [sortBy: orden])
    }

    protected Tarea setValues(Tarea tarea, JSONObject json){

        tarea.asunto = json.asunto

        tarea.estado = json.estado

        tarea.prioridad = json.prioridad

        tarea.descripcion = json.descripcion
        
        tarea.fechaInicio = json.fechaInicio ? Date.parse("dd/MM/yyyy", json.fechaInicio) : null 
        
        tarea.fechaVencimiento = json.fechaVencimiento ? Date.parse("dd/MM/yyyy", json.fechaVencimiento) : null 
       
        tarea.tareaSuperior = json.restaurada ? tarea.tareaSuperior : Tarea.get(json?.idTareaSuperior) 
 
        tarea.tipo = Clasificacion.get(json?.tipo?.id) 

        json?.idDocumentos?.each{ id -> tarea.addToDocumentos(Documento.get(id))} 

        json?.idSeguimientos?.each{ id -> tarea.addToSeguimientos(Seguimiento.get(id))} 

        json?.idTareasRelacionadas?.each{ id -> tarea.addToTareasRelacionadas(Tarea.get(id))}

        if(tarea.asignados){
            def asignados = Usuario.executeQuery("from Usuario u where :tarea in elements(u.asignadas)", [tarea: tarea])
            asignados*.removeFromAsignadas(tarea)
            if(tarea.asignados != null){tarea.asignados.clear()}
        }
        json?.asignados?.each { usuario -> tarea.addToAsignados(Usuario.get(usuario.id))}
        
        if(tarea.seguidores){
            def seguidores = Usuario.executeQuery("from Usuario u where :tarea in elements(u.seguidas)", [tarea: tarea])
            seguidores*.removeFromSeguidas(tarea)
            if(tarea.seguidores != null){tarea.seguidores.clear()}
        }        
        json?.seguidores?.each { usuario -> tarea.addToSeguidores(Usuario.get(usuario.id))}
        
        if(tarea.borrado != json?.borrado as Boolean){
            borradoRecursivo(tarea, json.borrado as Boolean)
        }
        
        return tarea

    }

    /*
    * Este metodo se ejecuta cuando se esta a punto de eliminar una o mas tareas.
    * Elimina todas las relaciones de la tarea antes de que pueda ser eliminada evitando
    * las excepciones por referencias de foreign keys.
    */
    protected clearValues(Tarea tarea){
        
        if(tarea.tareaSuperior){ 
            tarea.tareaSuperior.removeFromTareasRelacionadas(tarea)
        }
        tarea.responsable.removeFromCreadas(tarea)

        def asignados = Usuario.executeQuery("from Usuario u where :tarea in elements(u.asignadas)",[tarea: tarea])
        asignados.each{it.removeFromAsignadas(tarea)
            it.save(flush: true)
        }
        tarea.asignados.clear()
        
        def seguidores = Usuario.executeQuery("from Usuario u where :tarea in elements(u.seguidas)",[tarea: tarea])
        seguidores.each{it.removeFromSeguidas(tarea)
            it.save(flush: true)
        }
        tarea.seguidores.clear()

        tarea.tipo = null
        tarea.tareasRelacionadas.each{it.tareaSuperior = null}
        tarea.tareasRelacionadas.clear()
        tarea.save(flush: true)

    }

    /*
    * Este metodo realiza un cambio recursivo de la variable logica encargada
    * de marcar una tarea como eliminada en la papelera o activa.
    */
    protected borradoRecursivo(Tarea tarea, Boolean borrado){
        tarea.borrado = borrado
        tarea.tareasRelacionadas.each{
            borradoRecursivo(it, borrado)
        }
    }
}
