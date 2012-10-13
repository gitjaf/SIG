class UrlMappings {

	static mappings = {
		
		"/$controller"{
			action = [GET: "list", POST: "save"]
		}
		
		"/$controller/$id"{
			action = [GET: "show", DELETE: "delete", PUT: "update"]
		}
		
		"/"(view:'/index')
		"500"(view:'/error')
	}
}
