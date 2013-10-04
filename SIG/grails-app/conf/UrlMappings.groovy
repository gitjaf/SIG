class UrlMappings {

	static mappings = {
		
		name signin: "/login"(controller: "login"){
			action = [GET: "getStatus", POST: "login"]
		}

		name signout: "/logout"(controller: "logout"){
			action = [GET: "logout"]
		}

		name resources: "/$controller"{
			action = [GET: "list", POST: "find", PUT: "save", DELETE: "vaciarPapelera"]
		}
		
		name resource: "/$controller/$id"{
			action = [GET: "show", DELETE: "delete", PUT: "update"]
		}
	

		"/"(view:'/index')

		"500"(view:'/error')


		//Agregado para app-info
		"/admin/manage/$action?"(controller: "adminManage")
		"/adminManage/$action?"(controller: "errors", action: "urlMapping")
 
		"403"(controller: "errors", action: "accessDenied")
		"404"(controller: "errors", action: "notFound")
		"405"(controller: "errors", action: "notAllowed")
		"500"(controller: "errors", action: "error")
	}
}
