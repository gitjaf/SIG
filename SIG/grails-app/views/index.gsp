<!DOCTYPE html>
<html data-ng-app="sig">
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
		<div class="navbar-inner" data-ng-controller="ListaTareaCtrl">
			<a class="brand" data-ng-click="$emit('filter', '')">Tareas</a>
			<ul class="nav">
				<li data-ng-class="{active: isActive('') == undefined}"><a data-ng-click="$emit('filter', '')">Todas</a></li>
				<li data-ng-class="{active: isActive('Nueva')}"><a data-ng-click="$emit('filter', 'Nueva')">A Iniciar</a></li>
				<li data-ng-class="{active: isActive('En Curso')}"><a data-ng-click="$emit('filter', 'En Curso')">En Curso</a></li>
				<li data-ng-class="{active: isActive('Terminada')}"><a data-ng-click="$emit('filter', 'Terminada')">Terminadas</a></li>
				<li data-ng-class="{active: isActive('Cerrada')}"><a data-ng-click="$emit('filter', 'Cerrada')">Cerradas</a></li>
			</ul>
		</div>
	</div>
	<div data-ng-view>
	</div>
	
<r:layoutResources/>
</body>
</html>