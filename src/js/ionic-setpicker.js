"use strict";
var app = angular.module('ionic-setpicker', ['ionic', 'ionic-setpicker.factory.city', 'ionic-setpicker.factory.single', 'ionic-setpicker.factory.set', 'ionic-setpicker.factory.date', 'ionic-setpicker.factory.popup', 'ionic-setpicker.directive', 'ionic-setpicker.templates']);

app.directive('compile', ['$compile',
    function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(
                    function (scope) {
                        return scope.$eval(attrs.compile);
                    },
                    function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            }
        }
    }]);

app.directive('ionicSetPicker', ['$ionicPopup', '$timeout', '$ionicScrollDelegate', '$ionicModal', 'CityFactory', 'SingleFactory', 'SetFactory', 'DateFactory', 'PopupFactory',
    function ($ionicPopup, $timeout, $ionicScrollDelegate, $ionicModal, CityFactory, SingleFactory, SetFactory, DateFactory, PopupFactory) {

        return {
            restrict: 'AE',
            template: '<div ng-if="setmodel.settype!=\'popup\'" class={{setmodel.cssClass}}><i class={{setmodel.iconClass}}></i><span class="item-title">{{setmodel.title}}</span><span class="item-note">{{setmodel.display}}</span></div>' +
            '<span ng-if="setmodel.settype==\'popup\'" class="item-note" style="color: #4b8bf4; padding-right: 15px;">{{setmodel.display}}</span>',
            scope: {
                model: '=setModel'
            },
            link: function (scope, element, attrs) {
                scope.setmodel = scope.model;
                scope.setmodel.isWorking = false;
                scope.setmodel.platformId = ionic.Platform.platform();
                scope.setmodel.uuid = Math.random().toString(36).substring(3, 8);
                scope.setmodel.Handle = 'Handle-' + scope.setmodel.uuid;
                scope.setmodel.step = 36; // 滚动步长 （li的高度）
                scope.setmodel.selectValue = "";
                scope.setmodel.cssClass = 'ionic-setpicker item ' + (angular.isDefined(scope.setmodel.cssClass) ? 'item-icon-left' : '');
                scope.setmodel.iconClass = 'icon ' + (angular.isDefined(scope.setmodel.iconClass) ? scope.setmodel.iconClass : '');
                scope.setmodel.barCssClass = angular.isDefined(scope.setmodel.barCssClass) ? scope.setmodel.barCssClass : 'bar-stable';

                scope.setmodel.settemplatesModel = null;
                scope.setmodel.settemplates = '';
                scope.setmodel.settype = attrs["setType"];

                scope.setmodel.factory = {};

                switch (scope.setmodel.settype) {
                    case "city":
                        scope.setmodel.factory = CityFactory;
                        break;
                    case "single":
                        scope.setmodel.factory = SingleFactory;
                        break;
                    case "set":
                        scope.setmodel.factory = SetFactory;
                        break;
                    case "date":
                        scope.setmodel.factory = DateFactory;
                        break;
                    case "popup":
                        scope.setmodel.factory = PopupFactory;
                        break;
                }

                scope.setmodel.factory.init(scope);

                scope.setmodel.getDisplay = function () {
                    return scope.setmodel.factory.getDisplay(scope);
                };
                scope.setmodel.loadingData = function () {
                    return scope.setmodel.factory.loadingData(scope);
                };
                scope.setmodel.returnOk = function () {
                    return scope.setmodel.factory.returnOk(scope).then(function(){
                        scope.setmodel.settemplatesModel && scope.setmodel.settemplatesModel.hide();
                    });
                };
                scope.setmodel.getValue = function (name) {
                    return scope.setmodel.factory.getValue(scope, name);
                };

                scope.setmodel.display = scope.setmodel.getDisplay();

                scope.setmodel.returnCancel = function () {
                    scope.setmodel.settemplatesModel && scope.setmodel.settemplatesModel.hide();
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
                    if (scope.setmodel.settemplatesModel) {
                        scope.setmodel.settemplatesModel.show();
                        scope.setmodel.loadingData(scope.setmodel.value);
                    } else {
                        $ionicModal.fromTemplateUrl(scope.setmodel.settemplates, {
                                scope: scope,
                                animation: 'no-animation',
                                backdropClickToClose: false,
                                hardwareBackButtonClose: true
                            })
                            .then(function (modal) {
                                scope.setmodel.settemplatesModel = modal;
                                $timeout(function () {
                                    scope.setmodel.settemplatesModel.show();
                                    scope.setmodel.loadingData(scope.setmodel.value);
                                }, 50)
                            })
                    }
                });
                scope.$on('$destroy', function () {
                    scope.setmodel.settemplatesModel && scope.setmodel.settemplatesModel.remove();
                });
            }

        }

    }]);