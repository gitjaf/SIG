package org.sigma.code.tareas

import grails.converters.JSON
import org.sigma.code.common.*
import grails.gorm.*
import org.codehaus.groovy.grails.web.json.JSONObject
import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import com.sun.mail.util.MailConnectException

class TareaService {

    def mailService

    LinkGenerator grailsLinkGenerator

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
		
		def tarea = this.setValues(new Tarea(), json)

        def nuevos = this.asignarTarea(tarea, json)

        usuario.addToCreadas(tarea)

        if(!tarea.save(flush: true)){
            return null
        }

        this.notificarUsuarios(nuevos, tarea)

        return tarea

    }

    Tarea updateTarea(Tarea tarea, JSONObject json){
                
        tarea = this.setValues(tarea, json)

        def nuevos = this.asignarTarea(tarea, json)

        if(!tarea.save(flush: true)){
            return null
        }

        this.notificarUsuarios(nuevos, tarea)

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

    def notificarUsuarios(Map nuevos, Tarea tarea){
        
        try{
            nuevos.asignados.each{
                def email = it.username + "@frd.utn.edu.ar" 
                mailService.sendMail {
                    async true
                    to "${email}"
                    from "SIG@Tareas"
                    subject "Nueva Tarea"
                    html (view: '/mail/notification', model: [tarea: tarea, url: grailsLinkGenerator.serverBaseURL])
                }
            }
            
            nuevos.seguidores.each{
                def email = it.username + "@frd.utn.edu.ar" 
                mailService.sendMail {
                    async true
                    to "${email}"
                    from "SIG@Tareas"
                    subject "Nueva Tarea"
                    html (view: '/mail/notification', model: [tarea: tarea, url: grailsLinkGenerator.serverBaseURL])
                }
            }
        } catch (Exception e){
            println "No se pudo notificar por mail"
        }
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

    def getTareas = { params, String idUsuario ->
        
        if(params.tareaSuperior){
            def borrado = params?.filtro == "papelera"
            return this.getSubTareas(params.tareaSuperior as Integer, borrado, params?.sortBy)
        }

        def usuario = Usuario.get(idUsuario as Integer)

        def tareas = []

        def queryParams = [usuario: usuario, borrado: false]

        if(usuario){
            switch(params.filtro) {
                case "propias":
                    tareas += this.getTareasPropias(queryParams, params)
                    return tareas
                break

                case "asignadas":
                    tareas += this.getTareasAsignadas(queryParams, params)
                    tareas += this.getSubtareasAsignadas(queryParams, params)
                    return tareas
                break

                case "seguidas":
                    tareas += this.getTareasSeguidas(queryParams, params)
                    tareas += this.getSubtareasSeguidas(queryParams, params)
                    return tareas
                break

                case "papelera":
                    tareas += this.getTareasEnPapelera(queryParams, params)
                    return tareas
                break

                default:
                    tareas += this.getTareasTodas(queryParams, params)
                    return tareas            
            }


            // if (params.q) {
            //     query += this.getBusquedaTareas(params.q, queryParams)
            // }
                    
            // query += " and ( t.borrado = :borrado ) " + " order by t.${params.sortBy}"
            
            // queryParams['borrado'] = borrado 
            
            
            // tareas = Tarea.executeQuery(query, queryParams)

        } 

        // if(!superior){
        //     tareas = tareas.findAll{ it -> 
        //         !it.tareaSuperior || it.tareaSuperior.borrado == false
        //     }
        // }
        // return tareas
    }

    def getBusquedaTareas(String busqueda, Map queryParams){
        queryParams['search'] = "%" + busqueda + "%" 
        return " and ( lower(t.asunto) like lower(:search) or " +
            " lower(t.estado) like lower(:search) or " +
            " lower(t.prioridad) like lower(:search) ) " 
    }

    def getTareasPropias(Map queryParams, Map params){
        def query = "from org.sigma.code.tareas.Tarea as t where t.responsable = :usuario and " +
                    " ( t.borrado = :borrado )  and t.tareaSuperior = null"
        if (params.q){
            query += getBusquedaTareas(params.q, queryParams)
        }
        return (Tarea.executeQuery(query, queryParams))
    }

    
    protected getTareasAsignadas(Map queryParams, Map params){
        def query = "from org.sigma.code.tareas.Tarea as t where " +
                    " :usuario in elements(t.asignados) and (t.tareaSuperior is null) and " +
                    " (t.borrado = :borrado) "

        if (params.q){
            query += getBusquedaTareas(params.q, queryParams)
        }

        return (Tarea.executeQuery(query, queryParams))
                
    }

    protected getSubtareasAsignadas(Map queryParams, Map params){
        def query = "from org.sigma.code.tareas.Tarea as t where " +
                    " :usuario in elements(t.asignados) and (t.tareaSuperior is not null) and " +
                    " (:usuario not in elements(t.tareaSuperior.asignados)) and " +
                    " (:usuario not in elements(t.tareaSuperior.seguidores)) and " +
                    " (:usuario <> t.tareaSuperior.responsable ) and " +
                    " (t.borrado = :borrado) "

        if (params.q){
            query += getBusquedaTareas(params.q, queryParams)
        }

        return (Tarea.executeQuery(query, queryParams))
    }

    protected getTareasSeguidas(Map queryParams, Map params){
         def query = "from org.sigma.code.tareas.Tarea as t where " +
                    " :usuario in elements(t.seguidores) and (t.tareaSuperior is null) and " +
                    " (t.borrado = :borrado) "

        if (params.q){
            query += getBusquedaTareas(params.q, queryParams)
        }

        return (Tarea.executeQuery(query, queryParams))
        
    }

    protected getSubtareasSeguidas(Map queryParams, Map params) {
         def query = "from org.sigma.code.tareas.Tarea as t where " +
                    " :usuario in elements(t.seguidores) and (t.tareaSuperior is not null) and " +
                    " (:usuario not in elements(t.tareaSuperior.seguidores)) and " +
                    " (:usuario not in elements(t.tareaSuperior.asignados)) and " +
                    " (:usuario <> t.tareaSuperior.responsable ) and " +
                    " (t.borrado = :borrado) "

        if (params.q){
            query += getBusquedaTareas(params.q, queryParams)
        }

        return (Tarea.executeQuery(query, queryParams))
    }

    protected getTareasTodas(Map queryParams, Map params){
        def tareas = (this.getTareasPropias(queryParams, params) + this.getTareasAsignadas(queryParams, params) +
                     this.getTareasSeguidas(queryParams, params) + this.getSubtareasAsignadas(queryParams, params) +
                     this.getSubtareasSeguidas(queryParams, params))
        
        return tareas
    }

    protected getTareasEnPapelera(Map queryParams, Map params){
        
        def query = "from org.sigma.code.tareas.Tarea as t where " +
                    " (t.tareaSuperior is null and t.borrado = true and t.responsable = :usuario)"
        def tareas = [] 

        Tarea.executeQuery(query, [usuario: queryParams.usuario]).each{
            tareas << it
        }

        query = "from org.sigma.code.tareas.Tarea as t where " +
                " (t.tareaSuperior.borrado = false and t.borrado = true and t.responsable = :usuario) "

        Tarea.executeQuery(query, [usuario: queryParams.usuario]).each{
            tareas << it
        }
        
        return tareas

    }

    protected getSubTareas(int id, Boolean borrado, String orden){
        def tarea = Tarea.get(id)      
        return Tarea.findAllByTareaSuperiorAndBorrado(tarea, borrado, [sortBy: orden])
    }


    protected Tarea setValues(Tarea tarea, JSONObject json){

        tarea.asunto = json.asunto

        tarea.estado = json.estado

        tarea.prioridad = json.prioridad

        tarea.descripcion = json.descripcion
        
        tarea.fechaInicio = json.fechaInicio ? Date.parse("dd/MM/yyyy", json.fechaInicio) : null 

        tarea.fechaRevision = json.fechaRevision ? Date.parse("dd/MM/yyyy", json.fechaRevision) : null
        
        tarea.fechaVencimiento = json.fechaVencimiento ? Date.parse("dd/MM/yyyy", json.fechaVencimiento) : null 
       
        tarea.tareaSuperior = json.restaurada ? tarea.tareaSuperior : Tarea.get(json?.idTareaSuperior) 
 
        tarea.tipo = Clasificacion.get(json?.tipo?.id) 

        json?.idDocumentos?.each{ id -> tarea.addToDocumentos(Documento.get(id))} 

        json?.idSeguimientos?.each{ id -> tarea.addToSeguimientos(Seguimiento.get(id))} 

        json?.idTareasRelacionadas?.each{ id -> tarea.addToTareasRelacionadas(Tarea.get(id))}

       
        
        if(tarea.borrado != json?.borrado as Boolean){
            borradoRecursivo(tarea, json.borrado as Boolean)
        }
        
        return tarea

    }

    protected asignarTarea(Tarea tarea, JSONObject json){
        def nuevos = [:] 
        def asignar = json?.asignados?.collect {usuario -> Usuario.get(usuario.id)}
        def seguir = json?.seguidores?.collect {usuario -> Usuario.get(usuario.id)}

        if(asignar){
            if(tarea.asignados){
                def asignados = Usuario.executeQuery("from Usuario u where :tarea in elements(u.asignadas)", [tarea: tarea])
                asignados*.removeFromAsignadas(tarea)
                if(tarea.asignados != null){tarea.asignados.clear()}

                nuevos << [asignados: (asignar - asignados)]
            } else {
                nuevos << [asignados: asignar]
            }
            
            asignar.each { usuario -> tarea.addToAsignados(usuario)}
        }

        if(seguir){
            if(tarea.seguidores){
                def seguidores = Usuario.executeQuery("from Usuario u where :tarea in elements(u.seguidas)", [tarea: tarea])
                seguidores*.removeFromSeguidas(tarea)
                if(tarea.seguidores != null){tarea.seguidores.clear()}
                nuevos << [seguidores: (seguir - seguidores)]
            } else {
                nuevos << [seguidores: seguir]
            }

            seguir.each { usuario -> tarea.addToSeguidores(usuario)}
        }

        return nuevos
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
