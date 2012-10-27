<html ng-app="sig">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<r:require module="angular" />
<r:require module="application"/>
<r:require module="customBootstrap"/>
<r:layoutResources />
</head>
<body>
	<div class="navbar">
		<div class="navbar-inner">
			<a class="brand" href="#">Tareas</a>
			<ul class="nav">
				<li ng-class="{active: query == ''}"><a href="#/tareas" ng-click="query = ''">Todas</a></li>
				<li ng-class="{active: query == 'Nueva'}"><a  ng-href="#/tareas/pendientes" ng-click="query = 'Nueva'">A Iniciar</a></li>
				<li ng-class="{active: query == 'En Curso'}"><a  ng-href="#/tareas/encurso" ng-click="query = 'En Curso'">En Curso</a></li>
				<li ng-class="{active: query == 'Terminada'}"><a  ng-href="#/tareas/terminada" ng-click="query = 'Terminada'">Terminadas</a></li>
				<li ng-class="{active: query == 'Cerrada'}"><a  ng-href="#/tareas/cerrada" ng-click="query = 'Cerrada'">Cerradas</a></li>
			</ul>
		</div>
	</div>
	<div ng-view>
	</div>
	
<r:layoutResources/>
</body>
</html>