'use strict';
app.controller('home', function($scope, $parse, $rootScope) {
    // Public Methods
    $scope.onSubmit = function onSubmit() {
        $scope.submittedData = $scope.formData;
    };

    $scope.toPrettyJSON = function(obj, tabWidth) {
        var strippedObj = angular.copy(obj);
        var result = JSON.stringify(strippedObj, null, Number(tabWidth));
        return result;
    };

    // Private Methods

    // Events
    $scope.$watch('formFieldsStr', function onOptionsUpdated(newValue, OldValue) {
        try {
            $scope.formFields = $parse(newValue)({});
            $scope.formFieldsError = false;
        } catch (e) {
            // eat $parse error
            // console.log('Formly Demo App Error: error parsing data, changes not applied');
            $scope.formFieldsError = true;
        }
    });
    $scope.$watch('formOptionsStr', function onOptionsUpdated(newValue, OldValue) {
        try {
            $scope.formOptions = $parse(newValue)({});
            $scope.formOptionsError = false;
        } catch (e) {
            // eat $parse error
            // console.log('Formly Demo App Error: error parsing data, changes not applied');
            $scope.formOptionsError = true;
        }
    });

    // Public Vars
    $scope.formFields = [{
        label: '电子邮箱',
        key: 'email',
        type: 'email',
        placeholder: 'janedoe@gmail.com',
        defaultVal: 'ghld@126.com',
        validate: {
            required: true,
            maxlength: 10
            // pattern: '/^[\\d]*@\\.$/'
        },
        msg: {
            help: '这里是普通的help文档',
            xrequired: '必填项',
            maxlength: '最长长度超过了',
            pattern: 'pattern不正确'
        },
        attr: {
            'dynamicAttr': 'value-for'
        }
    }, {
        referTpl: '#input-extra-diy'
    }, {
        referTpl: '#input-extra-watch'
    }, {
        referTpl: '#input-extra-uploader'
    }, {
        label: 'textarea控件',
        key: 'textarea',
        type: 'textarea',
        attr: {
            'text-area-elastic': true,
            'rows': '4',
            'cols': '50'
        },
        validate: {
            required: true,
            maxlength: 20,
            minlength: 4
        },
        msg: {
            help: '这里是textarea的help文档',
            xrequired: '必填项',
            maxlength: '最长长度超过了'
        }
    }, {
        type: 'select',
        label: 'select控件',
        key: 'vehicle',
        info: '请选择交通工具',
        options: [{
            name: 'Car',
            value: 'car',
            group: 'inefficiently'
        }, {
            name: 'Helicopter',
            group: 'inefficiently'
        }, {
            name: 'Sport Utility Vehicle',
            group: 'inefficiently'
        }, {
            name: 'Bicycle',
            group: 'efficiently'
        }, {
            name: 'Skateboard',
            group: 'efficiently'
        }]
    }, {
        type: 'password',
        label: 'Password',
        key: 'password'
    }, {
        type: 'checkbox',
        label: 'Check this here',
        key: 'checkbox1'
    }, {
        type: 'hidden',
        default: 'secret_code',
        key: 'secretCode'
    }];
    $scope.formOptions = {
        key: 'autoNgform',
        submitCopy: 'Save'
    };
    $scope.submittedData = null;
    $scope.formData = {};
    $scope.formFieldsStr = $scope.toPrettyJSON($scope.formFields, 4);
    $scope.formOptionsStr = $scope.toPrettyJSON($scope.formOptions, 4);
    $scope.formFieldsError = false;
    $scope.formOptionsError = false;
});

app.directive('message', [

    function() {
        function getFieldValidationExpr(formName, fieldName) {
            var fieldExpression = formName + '.' + fieldName;
            var invalidExpression = fieldExpression + '.$invalid';
            var dirtyExpression = fieldExpression + '.$dirty';
            var watchExpression = invalidExpression + ' && ' + dirtyExpression;
            return watchExpression;
        }

        function getFieldErrorExpr(formName, fieldName) {
            var fieldExpression = formName + '.' + fieldName;
            var errorExpression = fieldExpression + '.$error';
            return errorExpression;
        }

        function getFieldValueChangeExpr(formName, fieldName) {
            return formName + '.' + fieldName + '.$viewValue';
        }

        function getFieldCustErrExpr(formName, fieldName) {
            return formName + '.' + fieldName + '._custMsg';
        }
        var msgTable = {
            'required': '不能为空',
            'minlength': '长度过短',
            'maxlength': '长度过长',
            'email': '不是合法的email'
        };

        return {
            restrict: 'A',
            require: '^form',
            replace: true,
            template: '<div class="pmt-form-help-block"></div>',
            link: function($scope, el, attrs, ctrler) {
                var formName = ctrler.$name;
                var fieldName = attrs['for'];
                var watchExpr1 = getFieldValidationExpr(formName, fieldName);
                var watchExpr2 = getFieldErrorExpr(formName, fieldName);
                var watchValChangeExpr = getFieldValueChangeExpr(formName, fieldName);
                var watchCustErrExpr = getFieldCustErrExpr(formName, fieldName);

                var field = $scope[formName][fieldName];
                if (field) {
                    $scope[formName][fieldName]._checkShowMsg = checkShowMsg;
                }

                function checkShowMsg() {
                    var field = $scope[formName][fieldName];
                    var errShow, custMsg;
                    if (field) {
                        errShow = field.$invalid && field.$dirty;
                        if (field && field._custMsg) {
                            custMsg = field._custMsg;
                        }
                    }

                    var html, helpstr;
                    // if (errShow) {
                    //     el.parents('.pmt-form-row').find('label').addClass('w-text-warning');
                    // } else {
                    //     el.parents('.pmt-form-row').find('label').removeClass('w-text-warning');
                    // }
                    if (errShow || custMsg) {
                        var errors = field.$error;
                        var errmsg;
                        for (var error in errors) {
                            if (errors[error] && errors.hasOwnProperty(error)) {
                                if (errors[error] && attrs[error]) {
                                    errmsg = attrs[error];
                                } else if (error === 'required' && attrs.xrequired) {
                                    errmsg = attrs.xrequired;
                                } else if (errors[error] && msgTable[error]) {
                                    errmsg = msgTable[error];
                                } else {
                                    errmsg = attrs.validation;
                                }
                                if (!errmsg) {
                                    errmsg = '请填写正确的信息';
                                }
                            }
                        }
                        if (custMsg) {
                            errmsg = custMsg;
                        }
                        helpstr = attrs.help || '';
                        html = helpstr + '<span class="pmt-form-help-inline w-text-warning">' + errmsg + '</span>';
                    } else {
                        html = attrs.help || '';
                    }
                    // html && angular.element(el).html(html);
                    angular.element(el).html(html);
                }
                $scope.$watch(watchExpr2, checkShowMsg, true);
                $scope.$watch(watchExpr1, checkShowMsg, true);
                $scope.$watch(watchCustErrExpr, checkShowMsg, true);
                $scope.$watch(watchValChangeExpr, function() {
                    var field = $scope[formName][fieldName];
                    if (field && field._custMsg) {
                        delete field._custMsg;
                    }
                });
            }
        };
    }
]);
app.directive('inputfield', [

    function() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            require: 'ngModel',
            scope: {
                labelfor: '@',
                labeltext: '@'
            },
            template: '<div class="pmt-form-row">' +
                '<label class="pmt-form-label" for="{{labelfor}}">{{ labeltext }}</label>' +
                '<div class="pmt-form-controls" ng-transclude>' +
                '</div>'
        };
    }
]);
app.directive('validateSubmit', [

    function($parse) {
        return {
            restrict: 'A',
            require: ['?form'],
            link: function(scope, formElement, attrs) {
                var form = scope[attrs.name];

                formElement.bind('submit', function() {
                    angular.forEach(form, function(field, name) {
                        if (typeof(name) === 'string' && !name.match('^[\$]')) {
                            if (field.$pristine && !field.$viewValue) {
                                field.$setViewValue('');
                            }
                            if (field.$viewValue) {
                                field.$setViewValue(field.$viewValue);
                            }
                        }
                    });
                    if (form.$valid) {
                        scope.$apply(attrs.validateSubmit);
                    }
                    scope.$apply();
                });
            }
        };
    }
]);

app.directive('pmtDatePicker', [

    function() {

        return {
            require: '?ngModel',
            link: function($scope, $elem, $attr, ngModelCtrl) {
                if (!$.fn.datetimepicker) return;
                ngModelCtrl.$formatters.unshift(function(valueFromModel) {
                    // return how data will be shown in input
                    if (!valueFromModel) return;
                    return new Date(valueFromModel).dateFormat('Y/m/d');
                });

                ngModelCtrl.$parsers.push(function(valueFromInput) {
                    // return how data should be stored in model
                    return new Date(valueFromInput).getTime();
                });
                var options = _.extend({
                    onChangeDateTime: function(dp, $input) {
                        ngModelCtrl.$setViewValue($input.val());
                    },
                    lang: 'zh',
                    format: 'Y/m/d',
                    defaultSelect: false,
                    scrollInput: false,
                    timepicker: false,
                    i18n: {
                        zh: {
                            months: [
                                '一月', '二月', '三月', '四月',
                                '五月', '六月', '七月', '八月',
                                '九月', '十月', '十一月', '十二月'
                            ],
                            dayOfWeek: [
                                '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
                            ]
                        }
                    }
                }, $scope.$eval($attr.picker));
                $elem.datetimepicker(options);
            }
        };
    }
]);
app.directive('textAreaElastic', ['$timeout', '$window',
    function($timeout, $window) {
        return {
            require: 'ngModel',
            restrict: 'A, C',
            link: function(scope, element, attrs, ngModel) {

                // cache a reference to the DOM element
                var ta = element[0],
                    $ta = element;

                // ensure the element is a textarea, and browser is capable
                if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                    return;
                }

                // set these properties before measuring dimensions
                $ta.css({
                    'overflow': 'hidden',
                    'overflow-y': 'hidden',
                    'word-wrap': 'break-word'
                });

                // force text reflow
                var text = ta.value;
                ta.value = '';
                ta.value = text;

                var append = '\n\n',
                    $win = angular.element($window),
                    mirrorStyle = 'position: absolute; top: -999px; right: auto; bottom: auto; left: 0 ;' +
                        'overflow: hidden; -webkit-box-sizing: content-box;' +
                        '-moz-box-sizing: content-box; box-sizing: content-box;' +
                        'min-height: 0 !important; height: 0 !important; padding: 0;' +
                        'word-wrap: break-word; border: 0;',
                    $mirror = angular.element('<textarea tabindex="-1" ' +
                        'style="' + mirrorStyle + '"/>').data('elastic', true),
                    mirror = $mirror[0],
                    taStyle = getComputedStyle(ta),
                    resize = taStyle.getPropertyValue('resize'),
                    borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                        taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                        taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                    boxOuter = !borderBox ? {
                        width: 0,
                        height: 0
                    } : {
                        width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                            parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                        height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                            parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                    },
                    minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                    heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                    minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                    maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                    mirrored,
                    active,
                    copyStyle = ['font-family',
                        'font-size',
                        'font-weight',
                        'font-style',
                        'letter-spacing',
                        'line-height',
                        'text-transform',
                        'word-spacing',
                        'text-indent'
                    ];

                // exit if elastic already applied (or is the mirror element)
                if ($ta.data('elastic')) {
                    return;
                }

                // Opera returns max-height of -1 if not set
                maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                // append mirror to the DOM
                if (mirror.parentNode !== document.body) {
                    angular.element(document.body).append(mirror);
                }

                // set resize and apply elastic
                $ta.css({
                    'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
                }).data('elastic', true);

                /*
                 * methods
                 */

                function initMirror() {
                    mirrored = ta;
                    // copy the essential styles from the textarea to the mirror
                    taStyle = getComputedStyle(ta);
                    angular.forEach(copyStyle, function(val) {
                        mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                    });
                    mirror.setAttribute('style', mirrorStyle);
                }

                function adjust() {
                    var taHeight,
                        mirrorHeight,
                        width,
                        overflow;

                    if (mirrored !== ta) {
                        initMirror();
                    }

                    // active flag prevents actions in function from calling adjust again
                    if (!active) {
                        active = true;

                        mirror.value = ta.value + append; // optional whitespace to improve animation
                        mirror.style.overflowY = ta.style.overflowY;

                        taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                        // update mirror width in case the textarea width has changed
                        width = parseInt(getComputedStyle(ta).getPropertyValue('width'), 10) - boxOuter.width;
                        mirror.style.width = width + 'px';

                        mirrorHeight = mirror.scrollHeight;

                        if (mirrorHeight > maxHeight) {
                            mirrorHeight = maxHeight;
                            overflow = 'scroll';
                        } else if (mirrorHeight < minHeight) {
                            mirrorHeight = minHeight;
                        }
                        mirrorHeight += boxOuter.height;

                        ta.style.overflowY = overflow || 'hidden';

                        if (taHeight !== mirrorHeight) {
                            ta.style.height = mirrorHeight + 'px';
                            scope.$emit('elastic:resize', $ta);
                        }

                        // small delay to prevent an infinite loop
                        $timeout(function() {
                            active = false;
                        }, 1);

                    }
                }

                function forceAdjust() {
                    active = false;
                    adjust();
                }

                /*
                 * initialise
                 */

                // listen
                if ('onpropertychange' in ta && 'oninput' in ta) {
                    // IE9
                    ta['oninput'] = ta.onkeyup = adjust;
                } else {
                    ta['oninput'] = adjust;
                }

                $win.bind('resize', forceAdjust);

                scope.$watch(function() {
                    return ngModel.$modelValue;
                }, function(newValue) {
                    forceAdjust();
                });

                $timeout(adjust);

                /*
                 * destroy
                 */

                scope.$on('$destroy', function() {
                    $mirror.remove();
                    $win.unbind('resize', forceAdjust);
                });
            }
        }
    }
]);

app.directive('pmtFileUploadField', [
    // hardcode - endpoin属性，由于nm.key组成，如app.icon
    // 同时，rootScope下有{key}Preview和{key}Warning在命名空间
    // 真正的storageKey放在scope[{nm}][{key}]下
    function() {
        var controller = function($scope, $element, $attrs, $rootScope, pmtUploadManager) {
            var optFromAttr = $scope.$eval($attrs.uploader) || {};
            var endpoint = $attrs.endpoint;
            var nm = endpoint.split('.')[0];
            var key = endpoint.split('.')[1];
            !$rootScope.vm && ($rootScope.vm = {});
            pmtUploadManager.getEndpoint(endpoint).on('add', function(e, task) {
                $rootScope.vm[key + 'Preview'] = '上传中，请稍等';
                $rootScope.vm[key + 'Warning'] = '';
                optFromAttr.add && optFromAttr.add(e, task);
                task.defer.promise.then(
                    function successFn(resp) {
                        if (optFromAttr.success) {
                            optFromAttr.success(resp);
                            return;
                        }
                        if (resp.response) {
                            resp = resp.response;
                        }
                        $scope[nm][key] = resp.storageKey;
                        $rootScope.vm[key + 'Preview'] = resp.url;
                    },
                    function errorFn(resp) {
                        $rootScope.vm[key + 'Preview'] = '';
                        $rootScope.vm[key + 'Warning'] = '上传失败，请检查网络或稍后再试';
                    },
                    function notifyFn(resp) {
                        optFromAttr.notify && optFromAttr.notify(resp);
                    }
                );
            }).on('error', function(e, errmsg) {
                $rootScope.vm[key + 'Warning'] = errmsg;
            });
        };

        return {
            controller: ['$scope', '$element', '$attrs', '$rootScope', 'pmtUploadManager', controller]
        };
    }
])