build{

	
	documento1(org.sigma.code.common.Documento, nombre: "Nombre 1")
	documento2(org.sigma.code.common.Documento, nombre: "Nombre 1")
	documento3(org.sigma.code.common.Documento, nombre: "Nombre 1")
	documento4(org.sigma.code.common.Documento, nombre: "Nombre 1")
		
	clasificacion1(org.sigma.code.tareas.Clasificacion, nombre: "Clasificacion1")
	clasificacion2(org.sigma.code.tareas.Clasificacion, nombre: "Clasificacion2")
	clasificacion3(org.sigma.code.tareas.Clasificacion, nombre: "Clasificacion3")
	clasificacion4(org.sigma.code.tareas.Clasificacion, nombre: "Clasificacion4")
	
	tarea1(org.sigma.code.tareas.Tarea, asunto: "Asunto 1", tipo: clasificacion1, documentos:[documento1, documento2])
	tarea2(org.sigma.code.tareas.Tarea, asunto: "Asunto 2", tipo: clasificacion2, documentos:[documento3])
	tarea3(org.sigma.code.tareas.Tarea, asunto: "Asunto 3", tipo: clasificacion3, documentos:[documento4])
	tarea4(org.sigma.code.tareas.Tarea, asunto: "Asunto 4", tipo: clasificacion4)

	persona1(org.sigma.code.common.Persona, nombres: "Nombres1", apellidos: "Apellidos1" )
	persona2(org.sigma.code.common.Persona, nombres: "Nombres2", apellidos: "Apellidos2" )
	persona3(org.sigma.code.common.Persona, nombres: "Nombres3", apellidos: "Apellidos3" )
	
	usuario1(org.sigma.code.common.Usuario, username: "unUsername1", persona: persona1, creadas: [tarea1], asignadas: [tarea2], seguidas: [tarea3, tarea4])
	usuario2(org.sigma.code.common.Usuario, username: "unUsername2", persona: persona2, creadas: [tarea3], asignadas: [tarea1], seguidas: [tarea2])
	usuario3(org.sigma.code.common.Usuario, username: "unUsername3", persona: persona3, creadas: [tarea2], asignadas: [tarea1], seguidas: [tarea3])
	
	seguimiento1(org.sigma.code.tareas.Seguimiento, titulo: "Titulo S1", fecha: new Date(), responsable: usuario1)	
	seguimiento2(org.sigma.code.tareas.Seguimiento, titulo: "Titulo S2", fecha: new Date(), responsable: usuario1)	
	seguimiento3(org.sigma.code.tareas.Seguimiento, titulo: "Titulo S3", fecha: new Date(), responsable: usuario2)
	seguimiento4(org.sigma.code.tareas.Seguimiento, titulo: "Titulo S4", fecha: new Date(), responsable: usuario2)
	
//	tarea1.addToSeguimientos(seguimiento1)
//	tarea1.addToSeguimientos(seguimiento3)
//	tarea2.addToSeguimientos(seguimiento2)
//	tarea2.addToSeguimientos(seguimiento4)
	
	
	
}