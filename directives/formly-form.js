'use strict';
angular.module('formly.render')
    .directive('formlyForm', function formlyForm($compile) {
        return {
            restrict: 'AE',
            templateUrl: 'directives/formly-form.html',
            replace: true,
            scope: true,
            link: function($scope, $elem, $attr) {
                $scope.options = $scope.$eval($attr.options);
                $scope.fields = $scope.$eval($attr.fields);
                $scope.$parent[$scope.options.key] = {};
                // $elem[0].setAttribute('name', $scope.options.key);
                $compile($elem.contents())($scope);
            }
        };
    });