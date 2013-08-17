class UrlMappings {

	static mappings = {
		
		"/login"(controller: "login"){
			action = [GET: "getStatus", POST: "login"]
		}

		"/$controller"{
			action = [GET: "list", POST: "save", DELETE: "vaciarPapelera"]
		}
		
		"/$controller/$id"{
			action = [GET: "show", DELETE: "delete", PUT: "update"]
		}
		
		"/"(view:'/index')

		"500"(view:'/error')
	}
}
