<html ng-app="sig">
<head>
<meta name="viewport" content="width=1368, initial-scale=1.0"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<r:require module="angular" />
<r:require module="application"/>
<r:require module="customBootstrap"/>
<r:layoutResources />
</head>
<body>
	<div class="navbar hidden-phone">
		<div class="navbar-inner" ng-controller="ListaTareaCtrl">
			<a class="brand" href="#">Tareas</a>
			<ul class="nav">
				<li ng-class="{active: isActive(undefined)}"><a href="#/tareas" ng-click="query = ''">Todas</a></li>
				<li ng-class="{active: isActive('Nueva')}"><a ng-click="$emit('filter', 'Nueva')">A Iniciar</a></li>
				<li ng-class="{active: isActive('En Curso')}"><a ng-click="$emit('filter', 'En Curso')">En Curso</a></li>
				<li ng-class="{active: isActive('Terminada')}"><a ng-click="$emit('filter', 'Terminada')">Terminadas</a></li>
				<li ng-class="{active: isActive('Cerrada')}"><a ng-click="$emit('filter', 'Cerrada')">Cerradas</a></li>
			</ul>
		</div>
	</div>
	<div ng-view>
	</div>
	
<r:layoutResources/>
</body>
</html>