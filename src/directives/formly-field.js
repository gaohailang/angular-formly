'use strict';
angular.module('formly.render')
    .directive('formlyField', function formlyField($http, $compile, $templateCache) {

        var getTemplateUrl = function(type) {
            var templateUrl = 'directives/formly-field.html';
            return templateUrl;
        };

        return {
            restrict: 'AE',
            replace: true,
            scope: false,
            link: function fieldLink($scope, $element, $attr) {
                $scope.options = $scope.$eval($attr.options);
                if ($scope.options.referTpl) {
                    $element.html(document.querySelector($scope.options.referTpl).innerHTML);
                    $compile($element.contents())($scope);
                    return;
                }
                var templateUrl = getTemplateUrl($scope.options.type);
                var $input, $msg;
                if (templateUrl) {
                    $http.get(templateUrl, {
                        cache: $templateCache
                    }).success(function(data) {
                        //template data returned
                        $element.html(data);
                        $input = $element.find($scope.options.type)[0] ? $element.find($scope.options.type)[0] : $element.find('input')[0];
                        $msg = $element.find('div')[1];
                        $input.setAttribute('ng-model', $scope.$parent.options.key + '.' + $scope.options.key);
                        $input.setAttribute('name', $scope.options.key);
                        if ($input && $scope.options.validate) {
                            angular.forEach($scope.options.validate, function(val, key) {
                                $input.setAttribute('ng-' + key, val);
                            });
                        }
                        if ($msg && $scope.options.msg) {
                            angular.forEach($scope.options.msg, function(val, key) {
                                $msg.setAttribute(key, val);
                            });
                        }
                        if ($input && $scope.options.attr) {
                            angular.forEach($scope.options.attr, function(val, key) {
                                $input.setAttribute(key, val);
                            });
                        }
                        $compile($element.contents())($scope);
                    });
                } else {
                    console.log('Formly Error: template type \'' + $scope.options.type + '\' not supported.');
                }
            },
            controller: function fieldController($scope) {
                return;
                $scope.options = $scope.optionsData();
                if ($scope.options.
                    default) {
                    $scope.value = $scope.options.
                    default;
                }

                // set field id to link labels and fields
                $scope.id = $scope.options.key;
            }
        };
    });