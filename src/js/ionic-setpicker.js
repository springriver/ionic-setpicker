"use strict";
var app = angular.module('ionic-setpicker', ['ionic', 'ionic-setpicker.service', 'ionic-setpicker.directive', 'ionic-setpicker.templates']);
app.directive('ionicSetPicker', ['$ionicPopup', '$timeout', 'CityPickerService', '$ionicScrollDelegate', '$ionicModal', function ($ionicPopup, $timeout, CityPickerService, $ionicScrollDelegate, $ionicModal) {

    return {
        restrict: 'AE',
        template: '<div class={{setmodel.cssClass}}><i class={{setmodel.iconClass}}></i>{{setmodel.title}}<span class="item-note">{{setmodel.display}}</span></div></div>',
        scope: {
            model: '=setModel'
        },
        //scope: true,
        link: function (scope, element, attrs) {
            scope.setmodel = scope.model;

            scope.setmodel.isWorking = false;
            scope.setmodel.platformId = scope.setmodel.platformId || cordova != null ? cordova.platformId : "";
            scope.setmodel.uuid = Math.random().toString(36).substring(3, 8);
            scope.setmodel.Handle = 'Handle-' + scope.setmodel.uuid;
            scope.setmodel.step = 36; // 滚动步长 （li的高度）
            scope.setmodel.selectValue = "";

            scope.setmodel.cssClass = 'ionic-setpicker item padding ' + (angular.isDefined(scope.setmodel.cssClass) ? 'item-icon-left' : '');
            scope.setmodel.iconClass = 'icon ' + (angular.isDefined(scope.setmodel.iconClass) ? scope.setmodel.iconClass : '');
            scope.setmodel.barCssClass = angular.isDefined(scope.setmodel.barCssClass) ? scope.setmodel.barCssClass : 'bar-stable';

            var settemplatesModel = null;
            var settemplates = '';
            var settype = attrs["setType"];
            switch (settype) {
                case "city":
                    settemplates = 'ionic-citypicker.html';
                    scope.setmodel.Service = CityPickerService;
                    scope.setmodel.provinceHandle = 'province-' + scope.setmodel.uuid;
                    scope.setmodel.cityHandle = 'city-' + scope.setmodel.uuid;
                    scope.setmodel.countryHandle = 'country-' + scope.setmodel.uuid;
                    scope.setmodel.tag = "-";

                    scope.setmodel.getDisplay = function (value) {
                        if (value == null)
                            return '请选择';
                        else
                            return value;
                    };

                    scope.setmodel.loadingData = function (value) {
                        var AreaData = ['安徽省', '安庆市'];
                        if (value != null)
                            AreaData = value.split(scope.setmodel.tag);
                        if (AreaData[0]) { // 初始化省
                            for (var i = 0; i < scope.setmodel.Service.length; i++) {
                                if (AreaData[0] === scope.setmodel.Service[i].name) {
                                    $ionicScrollDelegate.$getByHandle(scope.setmodel.provinceHandle).scrollTo(0, i * scope.setmodel.step);
                                    scope.setmodel.province = scope.setmodel.Service[i];
                                    break;
                                }
                            }
                        }
                        if (AreaData[1] && scope.setmodel.province && scope.setmodel.province.sub) { // 初始化市
                            for (var i = 0; i < scope.setmodel.province.sub.length; i++) {
                                if (AreaData[1] === scope.setmodel.province.sub[i].name) {
                                    $ionicScrollDelegate.$getByHandle(scope.setmodel.cityHandle).scrollTo(0, i * scope.setmodel.step);
                                    scope.setmodel.city = scope.setmodel.province.sub[i];
                                    break;
                                }
                            }
                        }
                        if (AreaData[2] && scope.setmodel.city && scope.setmodel.city.sub) { // 初始化区
                            for (var i = 0; i < scope.setmodel.city.sub.length; i++) {
                                if (AreaData[2] === scope.setmodel.city.sub[i].name) {
                                    $ionicScrollDelegate.$getByHandle(scope.setmodel.countryHandle).scrollTo(0, i * scope.setmodel.step);
                                    scope.setmodel.country = scope.setmodel.city.sub[i];
                                    break;
                                }
                            }
                        }
                    };

                    scope.setmodel.returnOk = function () {
                        if (scope.setmodel.isWorking)
                            return;
                        $timeout(function () {
                            if (scope.setmodel.country == null) {
                                if (scope.setmodel.city && scope.setmodel.city.sub && scope.setmodel.city.sub.length > 0) {
                                    scope.setmodel.country = scope.setmodel.city.sub[0];
                                }
                            }
                            (scope.setmodel.city && scope.setmodel.city.sub && scope.setmodel.city.sub.length > 0) ? (scope.setmodel.value = scope.setmodel.province.name + scope.setmodel.tag + scope.setmodel.city.name + scope.setmodel.tag + scope.setmodel.country.name ) : (scope.setmodel.value = scope.setmodel.province.name + scope.setmodel.tag + scope.setmodel.city.name);
                            scope.setmodel.display = scope.setmodel.getDisplay(scope.setmodel.value);
                            $timeout(function () {
                                settemplatesModel && settemplatesModel.hide();
                            }, 50)
                        }, 500)
                    };

                    scope.setmodel.getValue = function (name) {
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
                    break;
                case "single":
                    settemplates = 'ionic-singlepicker.html';

                    scope.setmodel.getDisplay = function (value) {
                        if (value == null)
                            return '请选择';
                        else
                            return value;
                    };

                    scope.setmodel.loadingData = function (value) {
                        if (value != null && value != '') {
                            for (var i = 0; i < scope.setmodel.Service.length; i++) {
                                if (value === scope.setmodel.Service[i]) {
                                    $ionicScrollDelegate.$getByHandle(scope.setmodel.Handle).scrollTo(0, i * scope.setmodel.step);
                                    break;
                                }
                            }
                        }
                    };

                    scope.setmodel.returnOk = function () {
                        if (scope.setmodel.isWorking)
                            return;
                        $timeout(function () {
                            if (scope.setmodel.selectValue == null || scope.setmodel.selectValue == '') {
                                if (scope.setmodel.Service != null && scope.setmodel.Service.length > 0)
                                    scope.setmodel.selectValue = scope.setmodel.Service[0];
                                else
                                    return;
                            }
                            scope.setmodel.value = scope.setmodel.selectValue;
                            scope.setmodel.display = scope.setmodel.getDisplay(scope.setmodel.value);
                            $timeout(function () {
                                settemplatesModel && settemplatesModel.hide();
                            }, 50)
                        }, 500)
                    };

                    scope.setmodel.getValue = function () {
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
                            scope.setmodel.selectValue = scope.setmodel.Service[step];
                        } finally {
                            scope.setmodel.isWorking = false;
                        }

                    };
                    break;
            }

            scope.setmodel.display = scope.setmodel.getDisplay(scope.setmodel.value);

            scope.setmodel.returnCancel = function () {
                settemplatesModel && settemplatesModel.hide();
                $timeout(function () {
                    scope.setmodel.loadingData(scope.setmodel.value);
                }, 150)
            };

            scope.setmodel.clickToClose = function () {
                scope.setmodel.backdropClickToClose && scope.setmodel.returnCancel();
            };

            scope.setmodel.scroll = function (name) {
                $timeout.cancel(scope.setmodel.scrolling);
                scope.setmodel.scrolling = $timeout(function () {
                    scope.setmodel.getValue(name);
                }, 1000)
            };

            element.on("click", function () {
                scope.setmodel.selectValue = scope.setmodel.value;
                if (settemplatesModel) {
                    settemplatesModel.show();
                    scope.setmodel.loadingData(scope.setmodel.value);
                } else {
                    $ionicModal.fromTemplateUrl(settemplates, {
                            scope: scope,
                            animation: 'slide-in-up',
                            backdropClickToClose: false,
                            hardwareBackButtonClose: true
                        })
                        .then(function (modal) {
                            settemplatesModel = modal;
                            $timeout(function () {
                                settemplatesModel.show();
                                scope.setmodel.loadingData(scope.setmodel.value);
                            }, 50)
                        })
                }
            });
            scope.$on('$destroy', function () {
                settemplatesModel && settemplatesModel.remove();
            });
        }

    }

}]);