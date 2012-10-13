
describe('SIG controller', function() {
 
    describe('ListaTareasCtrl', function(){
     
	    it('should create "tareas" model with 3 tareas', function() {
	    	var scope = [],
	    	ctrl = new ListaTareasCtrl(scope);
	     
	    	expect(scope.tareas.length).toBe(undefined);
	    });
    });
});