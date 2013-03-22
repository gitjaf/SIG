var directives = angular.module('sig.directives', []);

directives.directive("tooltip", function () {
    return function (scope, element, attrs) {
		scope.$watch("tareas", function(){
			element.tooltip({"delay": {"show": 500, "hide": 0}});
		})
	}
});

directives.directive("pager", function() {
    return {
    	replace: true,
    	transclude: true,
    	scope: {collection: '=collection'},
		templateUrl: 'js/templates/pager.html',
		restrict: 'E'
	}
});

directives.directive("taskbuttons", function() {
	return {
		scope: {item: '=item', edit:'&edit', addsub:'&addsub', addseg:'&addseg', del: '&delete'},
		restrict: 'A',
		templateUrl: 'js/templates/task-buttons.html'
		
	}
});

directives.directive("alert", function() {
	return {
		replace: true,
		scope: {title:'=title', message:'=message', alert: '=showon', type: '=type'},
		restrict: 'A',
		templateUrl: 'js/templates/alert.html',
		link: function(scope, element, attrs){
			scope.$watch("type", function(){
				element.removeClass('alert-error alert-success');
				element.addClass(scope.type);
				
			});

			scope.alert = false;
			
			scope.$watch("alert", function(){
				if(scope.alert){
					element.slideDown();
				} else {
					element.slideUp();
				}
			});

		}
	}
});

directives.directive("toggleLink", function($rootScope){
	return {
		transclude: true,
		scope: {obj: '@elementId', showt: '@showingText', hidet: '@hiddingText',
		 showi: '@showingIcon', hidei: '@hiddingIcon', showing: '@showing', hideon: '=hideOn', hide:'=hide'},
		template: '<a data-ng-href="{{obj}}" data-ng-transclude><i class="{{icon}}"></i>{{text}}</a>',
		restrict: 'E',
		link: function(scope, element, attrs){
			var showing = false;
			var obj;
			var effect;

			scope.$watch('showing', function(){
				showing = scope.showing;
				if(attrs.toggle != "collapse"){
					obj = scope.obj;
					scope.obj = "";
					effect = attrs.toggle.split('-');

					if(showing){
						scope.text = scope.showt;
						scope.icon = scope.showi;
					} else {
						angular.element(obj).addClass('hide');
						scope.text = scope.hidet;
						scope.icon = scope.hidei;
					}

				} else {

					if(showing){
						angular.element(scope.obj).addClass('in');
						scope.text = scope.showt;
						scope.icon = scope.showi;
						
					} else {
						scope.text = scope.hidet;
						scope.icon = scope.hidei;
						
					}
				}
			});

			scope.$watch('hideon', function(){
				if(scope.hideon){
					if(showing){
						toggle();
					}
				} else {
					if(!showing){
						toggle();
					}
				}
			});
	
			element.on('click', toggle);

			function toggle(){
				showing = !showing;

				if(effect !== undefined && effect[1] == 'left'){
					angular.element(obj).animate({
     					width: (showing ? 'show' : 'hide')
    				});
				} 

				if(effect !== undefined && effect[1] == 'up'){
					angular.element(obj).animate({
     					height: (showing ? 'show' : 'hide')
    				});
				} 	

				if($rootScope.$$phase == "$digest" || $rootScope.$$phase == "$apply"){
					change();
				} else {
					scope.$apply(change());
				}
			}

			function change(){
				if(showing){
					scope.hideon = undefined;
					scope.hide = undefined;
					scope.text = scope.showt;
					scope.icon = scope.showi;
					
				} else{
					scope.text = scope.hidet;
					scope.icon = scope.hidei;
					
				}
			}
		},

		replace: true
	}

});

directives.directive("confirmDeleteSeguimiento", function() {
	return {
		restrict: 'A',
		transclude: true,
		scope: true,
		template: '<div><div id="modal-confirm-seguimiento" style="display: none">'+
			    		'<h1>Eliminar Seguimiento</h1>' +
			    		'<p>Eliminar un seguimiento es una acción permanente, '+
    					'no se puede deshacer. ¿Confirma que desea eliminar este seguimiento?</p>'+
					'</div></div>',
		link: function(scope, element, attrs){

			//Eventos
			element.on("click", function(){
				angular.element("#modal-confirm-seguimiento").dialog2({
					id: 'confirm-seguimiento',
					buttons: {
						No: {
							click: function(){
								angular.element('#confirm-seguimiento').dialog2("close");
							},
							primary: false,
							type: "dialog-close"
						},
						Si: {
							click: function(){
								scope.eliminarSeguimiento(scope.seguimiento, scope.detalle);
								angular.element('#confirm-seguimiento').dialog2("close");
							},
							primary: false,
							type: "btn-danger"
						}
					},
					closeOnOverlayClick: true, // Should the dialog be closed on overlay click?
					closeOnEscape: true, // Should the dialog be closed if [ESCAPE] key is pressed?
					removeOnClose: true, // Should the dialog be removed from the document when it is closed?
					showCloseHandle: true, // Should a close handle be shown?
				});
			});
		}
		
	}
});

directives.directive("confirmDeleteTarea", function() {
	return {
		restrict: 'A',
		transclude: true,
		template: 	'<div id="modal-confirm-tarea" style="display: none">'+
			    		'<h1>Eliminar Tarea</h1>' +
			    		'<p>Esta acción eliminara la tarea del listado pero no del sistema.'+
    					' Podra consultarla accediendo a la papelera.'+
    					' ¿Confirma que desea enviar esta tarea a la papelera?</p>'+
					'</div>',
		link: function(scope, element, attrs){
			
			//Eventos
			element.on("click", function(){
				angular.element("#modal-confirm-tarea").dialog2({
					id: "confirm-delete-tarea",
					buttons: {
						No: {
							click: function(){
								angular.element('#confirm-delete-tarea').dialog2("close");
							},
							primary: false,
							type: "dialog-close"
						},
						Si: {
							click: function(){
								scope.item.borrado = true;
								scope.del(scope.item);
								angular.element('#confirm-delete-tarea').dialog2("close");
							},
							primary: false,
							type: "btn-danger"
						}
					},
					closeOnOverlayClick: true, // Should the dialog be closed on overlay click?
					closeOnEscape: true, // Should the dialog be closed if [ESCAPE] key is pressed?
					removeOnClose: true, // Should the dialog be removed from the document when it is closed?
					showCloseHandle: true, // Should a close handle be shown?
				});
			});
		}
		
	}
});
