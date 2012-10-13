<html ng-app="sig">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<r:require module="angular" />
<r:require module="application"/>
<r:require module="bootstrap-css"/>
<r:layoutResources />
</head>
<body>
	<div class="navbar">
		<div class="navbar-inner">
			<a class="brand" href="#">Tareas</a>
			<ul class="nav">
				<li class="active"><a href="#/tareas">Lista</a></li>
				<li><a href="#">Pendientes</a></li>
				<li><a href="#">Completadas</a></li>
			</ul>
		</div>
	</div>
	<div ng-view>
	</div>
	
<r:layoutResources/>
</body>
</html>