"use strict";
var app = angular.module('ionic-setpicker.factory.single', ['ionic']);
app.factory('SingleFactory', ['$ionicPopup', '$timeout', '$ionicScrollDelegate',
    function ($ionicPopup, $timeout, $ionicScrollDelegate) {
        var factory = {};

        factory.init = function (scope) {
            scope.setmodel.settemplates = 'ionic-singlepicker.html';
        };

        factory.getDisplay = function (scope) {
            if (scope.setmodel.value == null)
                return '请选择';
            else
                return scope.setmodel.value;
        };

        factory.loadingData = function (scope) {
            if (scope.setmodel.value != null && scope.setmodel.value != '') {
                var len = scope.setmodel.Service.length;
                for (var i = 0; i < len; i++) {
                    if (scope.setmodel.value === scope.setmodel.Service[i].key) {
                        $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).scrollTo(0, i * scope.setmodel.step);
                        break;
                    }
                }
            }
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
            if (scope.setmodel.isWorking)
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