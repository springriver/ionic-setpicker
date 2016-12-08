"use strict";
var app = angular.module('ionic-setpicker.factory.set', ['ionic']);
app.factory('SetFactory', ['$ionicPopup', '$timeout', '$ionicScrollDelegate',
    function ($ionicPopup, $timeout, $ionicScrollDelegate) {
        var factory = {};

        factory.init = function (scope) {
            scope.setmodel.settemplates = 'ionic-setpicker.html';
            scope.setmodel.tag = ",";

            scope.setmodel.selectAll = function (setmodel) {
                angular.forEach(setmodel.Service, function (data) {
                    data.isChecked = true;
                });
            };

            scope.setmodel.clearAll = function (setmodel) {
                angular.forEach(setmodel.Service, function (data) {
                    data.isChecked = false;
                });
            };
        };

        factory.getDisplay = function (scope) {
            if (scope.setmodel.value == null || scope.setmodel.value == "('')")
                return '请选择';
            else
                return scope.setmodel.value;
        };

        factory.loadingData = function (scope) {
            if (scope.setmodel.value != null && scope.setmodel.value != '') {
                var s = scope.setmodel.value;
                s = s.replace('(', '');
                s = s.replace(')', '');
                var ss = s.split(scope.setmodel.tag);
                angular.forEach(scope.setmodel.Service, function (data) {
                    data.isChecked = false;
                    angular.forEach(ss, function (datamx) {
                        if (datamx == "'" + data.key + "'")
                            data.isChecked = true;
                    });
                });
            }
            $timeout(function () {
                $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).scrollTop();
            }, 500)
        };

        factory.returnOk = function (scope) {
            var s = "";
            angular.forEach(scope.setmodel.Service, function (data) {
                if (data.isChecked) {
                    if (s != "")
                        s = s + ",";
                    s = s + "'" + data.key + "'"
                }
            });
            if (s == "")
                s = "''";
            s = "(" + s + ")";
            scope.setmodel.value = s;
            scope.setmodel.display = scope.setmodel.getDisplay();
            $timeout(function () {
                scope.setmodel.settemplatesModel && scope.setmodel.settemplatesModel.hide();
            }, 50)
        };

        factory.getValue = function (scope, name) {
            angular.forEach(scope.setmodel.Service, function (data) {
                if (data.key == name.key) {
                    if (data.isChecked)
                        data.isChecked = false;
                    else
                        data.isChecked = true;
                }
            });
        };

        return factory;
    }]);