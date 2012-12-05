var directives = angular.module('sig.directives', []);

// directives.directive('autocomplete', ['$http', function($http) {
//     return function (scope, element, attrs) {
//         element.autocomplete({
//             minLength:3,
//             source: function () {
// 				return [{"nombre":"Carlos Farina", "id":"1"},{"nombre":"Julian Farina", "id":"2"}, {"nombre":"German Cabral", "id":"3"}]                
//             },
//             focus:function (event, ui) {
//                 element.val(ui.item.nombre);
//                 return false;
//             },
//             select:function (event, ui) {
//                 scope.myModelId.selected = ui.item.value; scope.$apply;
//                 return false;
//             },
//             change:function (event, ui) {
//                 if (ui.item === null) {
//                     scope.myModelId.selected = null;
//                 }
//             }
//         }).data("autocomplete")._renderItem = function (ul, item) {
//             return $("<li></li>")
//                 .data("item.autocomplete", item)
//                 .append("<a>" + item.nombre + "</a>")
//                 .appendTo(ul);
//         };
//     }
// }]);

