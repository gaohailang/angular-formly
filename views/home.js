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
        type: 'email',
        placeholder: 'janedoe@gmail.com',
        key: 'email',
        default: 'ghld@126.com'
    }, {
        type: 'text',
        label: 'First Name',
        placeholder: 'Jane',
        key: "firstName"
    }, {
        type: 'text',
        label: 'Last Name',
        placeholder: 'Doe',
        key: 'lastName'
    }, {
        type: 'textarea',
        label: 'Tell me about yourself',
        placeholder: 'I like puppies',
        lines: 4,
        key: 'selfDescription'
    }, {
        type: 'radio',
        label: 'Have you tried EmberJs yet?',
        default: 'no',
        key: 'emberExperience',
        options: [{
            name: 'Yes, and I love it!',
            value: 'yesyes'
        }, {
            name: 'Yes, but I\'m not a fan...',
            value: 'yesno'
        }, {
            name: 'Nope',
            value: 'no'
        }]
    }, {
        type: 'text',
        label: 'Angular Fan?',
        disabled: true,
        default: 'yes',
        required: true,
        key: 'angularFan'
    }, {
        type: 'number',
        label: 'How much love?',
        default: 2,
        min: 0,
        max: 100,
        required: true,
        key: 'number'
    }, {
        type: 'select',
        label: 'How do you get around in the city',
        key: 'vehicle',
        options: [{
            name: 'Car',
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
        }, {
            name: 'Walk',
            group: 'efficiently'
        }, {
            name: 'Bus',
            group: 'efficiently'
        }, {
            name: 'Scooter',
            group: 'efficiently'
        }, {
            name: 'Train',
            group: 'efficiently'
        }, {
            name: 'Hot Air Baloon',
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
        uniqueFormId: 'simpleform',
        submitCopy: 'Save'
    };
    $scope.submittedData = null;
    $scope.formData = {};
    $scope.formFieldsStr = $scope.toPrettyJSON($scope.formFields, 4);
    $scope.formOptionsStr = $scope.toPrettyJSON($scope.formOptions, 4);
    $scope.formFieldsError = false;
    $scope.formOptionsError = false;
});