"use strict";
var app = angular.module('ionic-setpicker.factory.popup', ['ionic']);
app.factory('PopupFactory', ['$rootScope', '$ionicPopup', '$timeout', '$ionicScrollDelegate', '$http',
    function ($rootScope, $ionicPopup, $timeout, $ionicScrollDelegate, $http) {
        var factory = {};

        factory.init = function (scope) {
            scope.setmodel.settemplates = 'ionic-popuppicker.html';
        };

        factory.getDisplay = function (scope) {
            return '查找...';
        };

        factory.loadingData = function (scope) {
            var paramsMapping = scope.setmodel.RefParamsMapping.replace('EditorValue', scope.setmodel.value);
            var fields = scope.setmodel.RefFieldsMapping.split(';');

            var objTypeId = '';
            var opId = '';
            var ops = scope.setmodel.RefDatasourceCode.split('.');
            var len = ops.length;
            for (var i = 0; i < len; i++) {
                if (i == len - 1) {
                    opId = ops[i];
                } else {
                    if (objTypeId != "")
                        objTypeId = objTypeId + ".";
                    objTypeId = objTypeId + ops[i];
                }
            }

            scope.setmodel.Service = [];

            $http.get($rootScope.webapiEndpoint + '/api/app/' + objTypeId + '/' + opId + '?' + paramsMapping)
                .success(function (data) {
                    if (data.errorCode == 0) {
                        scope.setmodel.Service.length = 0;
                        if (data.data.zxd_data.dsTable != null && data.data.zxd_data.dsTable.length > 0) {
                            angular.forEach(data.data.zxd_data.dsTable, function (obj, index, array) {
                                var v = {};
                                if (fields.length >= 1)
                                    v.v1 = obj[fields[0]];
                                if (fields.length >= 2)
                                    v.v2 = obj[fields[1]];
                                if (fields.length >= 3)
                                    v.v3 = obj[fields[2]];
                                scope.setmodel.Service.push({key: obj.zxd_id, text: v});
                            });
                        }
                        $timeout(function () {
                            $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).scrollTop();
                        }, 500)
                    } else {
                        alert(data.data);
                    }
                })
                .error(function (e) {
                    alert(e);
                });

        };

        factory.returnOk = function (scope) {
            if (scope.setmodel.isWorking)
                return;
            $timeout(function () {
                if (scope.setmodel.selectValue == null || scope.setmodel.selectValue == '') {
                    if (scope.setmodel.Service != null && scope.setmodel.Service.length > 0)
                        scope.setmodel.selectValue = scope.setmodel.Service[0].key;
                    else
                        return;
                }
                scope.setmodel.value = scope.setmodel.selectValue;
                scope.setmodel.display = scope.setmodel.getDisplay();
                $timeout(function () {
                    scope.setmodel.settemplatesModel && scope.setmodel.settemplatesModel.hide();
                }, 50)
            }, 500)
        };

        factory.getValue = function (scope, name) {
            if (scope.setmodel.isWorking || scope.setmodel.Service.length == 0)
                return;
            scope.setmodel.isWorking = true;
            try {
                var top = $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).getScrollPosition().top; // 当前滚动位置
                var step = Math.round(top / scope.setmodel.step);
                if (scope.setmodel.platformId == 'android') {
                    $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).scrollTo(0, step * scope.setmodel.step, true);
                } else {
                    if (top % scope.setmodel.step !== 0) {
                        $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).scrollTo(0, step * scope.setmodel.step, true);
                    }
                }
                scope.setmodel.selectValue = scope.setmodel.Service[step].key;
            } finally {
                scope.setmodel.isWorking = false;
            }
        };

        return factory;
    }]);