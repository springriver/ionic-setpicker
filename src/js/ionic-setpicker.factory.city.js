"use strict";
var app = angular.module('ionic-setpicker.factory.city', ['ionic', 'ionic-setpicker.service']);
app.factory('CityFactory', ['$ionicPopup', '$timeout', 'CityPickerService', '$ionicScrollDelegate',
    function ($ionicPopup, $timeout, CityPickerService, $ionicScrollDelegate) {
        var factory = {};

        factory.init = function (scope) {
            scope.setmodel.settemplates = 'ionic-citypicker.html';
            scope.setmodel.Service = CityPickerService;
            scope.setmodel.provinceHandle = 'province-' + scope.setmodel.uuid;
            scope.setmodel.cityHandle = 'city-' + scope.setmodel.uuid;
            scope.setmodel.countryHandle = 'country-' + scope.setmodel.uuid;
            scope.setmodel.tag = "-";
        };

        factory.getDisplay = function (scope) {
            if (scope.setmodel.value == null)
                return '请选择';
            else
                return scope.setmodel.value;
        };

        factory.loadingData = function (scope) {
            var AreaData = ['安徽省', '安庆市'];
            if (scope.setmodel.value != null)
                AreaData = scope.setmodel.value.split(scope.setmodel.tag);
            if (AreaData[0]) { // 初始化省
                var len = scope.setmodel.Service.length;
                for (var i = 0; i < len; i++) {
                    if (AreaData[0] === scope.setmodel.Service[i].name) {
                        $ionicScrollDelegate.$getByHandle(scope.setmodel.provinceHandle).scrollTo(0, i * scope.setmodel.step);
                        scope.setmodel.province = scope.setmodel.Service[i];
                        break;
                    }
                }
            }
            if (AreaData[1] && scope.setmodel.province && scope.setmodel.province.sub) { // 初始化市
                var len = scope.setmodel.province.sub.length;
                for (var i = 0; i < len; i++) {
                    if (AreaData[1] === scope.setmodel.province.sub[i].name) {
                        $ionicScrollDelegate.$getByHandle(scope.setmodel.cityHandle).scrollTo(0, i * scope.setmodel.step);
                        scope.setmodel.city = scope.setmodel.province.sub[i];
                        break;
                    }
                }
            }
            if (AreaData[2] && scope.setmodel.city && scope.setmodel.city.sub) { // 初始化区
                var len = scope.setmodel.city.sub.length;
                for (var i = 0; i < len; i++) {
                    if (AreaData[2] === scope.setmodel.city.sub[i].name) {
                        $ionicScrollDelegate.$getByHandle(scope.setmodel.countryHandle).scrollTo(0, i * scope.setmodel.step);
                        scope.setmodel.country = scope.setmodel.city.sub[i];
                        break;
                    }
                }
            }
        };

        factory.returnOk = function (scope) {
            if (scope.setmodel.isWorking)
                return;
            $timeout(function () {
                if (scope.setmodel.country == null) {
                    if (scope.setmodel.city && scope.setmodel.city.sub && scope.setmodel.city.sub.length > 0) {
                        scope.setmodel.country = scope.setmodel.city.sub[0];
                    }
                }
                (scope.setmodel.city && scope.setmodel.city.sub && scope.setmodel.city.sub.length > 0) ? (scope.setmodel.value = scope.setmodel.province.name + scope.setmodel.tag + scope.setmodel.city.name + scope.setmodel.tag + scope.setmodel.country.name ) : (scope.setmodel.value = scope.setmodel.province.name + scope.setmodel.tag + scope.setmodel.city.name);
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
                $timeout.cancel(scope.setmodel.runing);
                switch (name) {
                    case 'province':
                        if (!scope.setmodel.Service) {
                            alert('province数据出错');
                        }
                        var province = true, Handle = scope.setmodel.provinceHandle, HandleChild = scope.setmodel.cityHandle;
                        break;
                    case 'city':
                        if (!scope.setmodel.province.sub) {
                            alert('city数据出错');
                        }
                        var city = true, Handle = scope.setmodel.cityHandle, HandleChild = scope.setmodel.countryHandle;
                        break;
                    case 'country':
                        if (!scope.setmodel.city.sub) {
                            alert('country数据出错');
                        }
                        var country = true, Handle = scope.setmodel.countryHandle, HandleChild = null;
                        break;
                }
                var top = $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top; // 当前滚动位置
                var step = Math.round(top / scope.setmodel.step);
                if (scope.setmodel.platformId == 'android') {
                    $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, step * scope.setmodel.step, true);
                } else {
                    if (top % scope.setmodel.step !== 0) {
                        $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, step * scope.setmodel.step, true);
                        return false;
                    }
                }
                scope.setmodel.runing = $timeout(function () {
                    province && (scope.setmodel.province = scope.setmodel.Service[step], scope.setmodel.city = scope.setmodel.province.sub[0], scope.setmodel.country = {}, (scope.setmodel.city && scope.setmodel.city.sub && (scope.setmodel.country = scope.setmodel.city.sub[0]))); //处理省市乡联动数据
                    city && (scope.setmodel.city = scope.setmodel.province.sub[step], scope.setmodel.country = {}, (scope.setmodel.city && scope.setmodel.city.sub && (scope.setmodel.country = scope.setmodel.city.sub[0]))); // 处理市乡联动数据
                    country && (scope.setmodel.country = scope.setmodel.city.sub[step]); // 处理乡数据
                    HandleChild && $ionicScrollDelegate.$getByHandle(HandleChild).scrollTop(); // 初始化子scroll top位
                }, 100)
            } finally {
                scope.setmodel.isWorking = false;
            }
        };

        return factory;
    }]);