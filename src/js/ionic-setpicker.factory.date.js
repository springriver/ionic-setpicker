"use strict";
var app = angular.module('ionic-setpicker.factory.date', ['ionic', 'ionic-setpicker.service']);
app.factory('DateFactory', ['$ionicPopup', '$timeout', '$filter', '$ionicScrollDelegate', 'DatePickerService',
    function ($ionicPopup, $timeout, $filter, $ionicScrollDelegate, DatePickerService) {
        var factory = {};

        factory.init = function (scope) {

            scope.setmodel.resetHMSM = function (date) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            };
            scope.setmodel.convertDateString = function (HMSM) {
                return $filter('date')(new Date(HMSM), 'yyyy-MM-dd');
            };

            scope.setmodel.settemplates = 'ionic-datepicker.html';

            scope.setmodel.weeksList = ["日", "一", "二", "三", "四", "五", "六"];
            scope.setmodel.monthsList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            scope.setmodel.disableWeekdays = [];

            scope.setmodel.mondayFirst = false;
            scope.setmodel.showTodayButton = true;
            scope.setmodel.closeOnSelect = false;

            //scope.setmodel.dateFormat = 'yyyy-MM-dd';
            //scope.setmodel.from = new Date("2010-01-01");

            scope.setmodel.setLabel = '确定';
            scope.setmodel.todayLabel = '今天';
            scope.setmodel.closeLabel = '关闭';

            scope.setmodel.today = scope.setmodel.resetHMSM(new Date()).getTime();
            scope.setmodel.disabledDates = [];

            if (scope.setmodel.value == null) {
                scope.setmodel.currentDate = scope.setmodel.resetHMSM(new Date());
            } else {
                scope.setmodel.currentDate = scope.setmodel.value;
            }

            scope.setmodel.prevMonth = function (setmodel) {
                if (setmodel.currentDate.getMonth() === 1) {
                    setmodel.currentDate.setFullYear(setmodel.currentDate.getFullYear());
                }
                setmodel.currentDate.setMonth(setmodel.currentDate.getMonth() - 1);
                setmodel.currentMonth = setmodel.monthsList[setmodel.currentDate.getMonth()];
                setmodel.currentYear = setmodel.currentDate.getFullYear();
                setmodel.refreshDateList(setmodel, setmodel.currentDate);
            };

            scope.setmodel.nextMonth = function (setmodel) {
                if (setmodel.currentDate.getMonth() === 11) {
                    setmodel.currentDate.setFullYear(setmodel.currentDate.getFullYear());
                }
                setmodel.currentDate.setDate(1);
                setmodel.currentDate.setMonth(setmodel.currentDate.getMonth() + 1);
                setmodel.currentMonth = setmodel.monthsList[setmodel.currentDate.getMonth()];
                setmodel.currentYear = setmodel.currentDate.getFullYear();
                setmodel.refreshDateList(setmodel, setmodel.currentDate);
            };

            scope.setmodel.dateSelected = function (setmodel, selectedDate) {
                if (!selectedDate || Object.keys(selectedDate).length === 0)
                    return;
                setmodel.selctedDateEpoch = selectedDate.epoch;
                scope.setmodel.selectValue = scope.setmodel.convertDateString(setmodel.selctedDateEpoch);
                if (setmodel.closeOnSelect) {
                    setmodel.returnOk(setmodel);
                }
            };

            scope.setmodel.setIonicDatePickerDate = function (setmodel) {
                setmodel.returnOk(setmodel);
            };

            scope.setmodel.setIonicDatePickerTodayDate = function (setmodel) {
                var today = new Date();
                setmodel.refreshDateList(setmodel, new Date());
                scope.setmodel.selectValue = scope.setmodel.convertDateString(setmodel.resetHMSM(today));
                setmodel.selctedDateEpoch = setmodel.resetHMSM(today).getTime();
                if (setmodel.closeOnSelect) {
                    setmodel.returnOk(setmodel);
                }
            };

            scope.setmodel.setDisabledDates = function (setmodel) {
                if (!setmodel.disabledDates || setmodel.disabledDates.length === 0) {
                    setmodel.disabledDates = [];
                } else {
                    setmodel.disabledDates = [];
                    angular.forEach(setmodel.disabledDates, function (val, key) {
                        val = setmodel.resetHMSM(new Date(val));
                        setmodel.disabledDates.push(val.getTime());
                    });
                }
            };

            scope.setmodel.refreshDateList = function (setmodel, date) {
                date = setmodel.resetHMSM(date);
                setmodel.currentDate = angular.copy(date);

                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

                setmodel.yearsList = DatePickerService.getYearsList(setmodel.from, setmodel.to);

                setmodel.dayList = [];

                var tempDate, disabled;
                setmodel.firstDayEpoch = setmodel.resetHMSM(new Date(date.getFullYear(), date.getMonth(), firstDay)).getTime();
                setmodel.lastDayEpoch = setmodel.resetHMSM(new Date(date.getFullYear(), date.getMonth(), lastDay)).getTime();

                for (var i = firstDay; i <= lastDay; i++) {
                    tempDate = new Date(date.getFullYear(), date.getMonth(), i);
                    disabled = (tempDate.getTime() < setmodel.fromDate) || (tempDate.getTime() > setmodel.toDate) || setmodel.disableWeekdays.indexOf(tempDate.getDay()) >= 0;

                    setmodel.dayList.push({
                        date: tempDate.getDate(),
                        month: tempDate.getMonth(),
                        year: tempDate.getFullYear(),
                        day: tempDate.getDay(),
                        epoch: tempDate.getTime(),
                        disabled: disabled
                    });
                }

                //To set Monday as the first day of the week.
                var firstDayMonday = setmodel.dayList[0].day - setmodel.mondayFirst;
                firstDayMonday = (firstDayMonday < 0) ? 6 : firstDayMonday;

                for (var j = 0; j < firstDayMonday; j++) {
                    setmodel.dayList.unshift({});
                }

                setmodel.rows = [0, 7, 14, 21, 28, 35];
                setmodel.cols = [0, 1, 2, 3, 4, 5, 6];

                setmodel.currentMonth = setmodel.monthsList[date.getMonth()];
                setmodel.currentYear = date.getFullYear().toString();
                setmodel.currentMonthSelected = angular.copy(setmodel.currentMonth);
                setmodel.currentYearSelected = angular.copy(setmodel.currentYear);
                setmodel.numColumns = 7;
            };

            scope.setmodel.yearChanged = function (setmodel, year) {
                setmodel.currentDate.setFullYear(year);
                setmodel.refreshDateList(setmodel, setmodel.currentDate);
            };

            scope.setmodel.monthChanged = function (setmodel, month) {
                var monthNumber = setmodel.monthsList.indexOf(month);
                setmodel.currentDate.setMonth(monthNumber);
                setmodel.refreshDateList(setmodel, setmodel.currentDate);
            };
        };

        factory.getDisplay = function (scope) {
            if (scope.setmodel.value == null)
                return '请选择';
            else
                return scope.setmodel.value;
        };

        factory.loadingData = function (scope) {
            var date = scope.setmodel.resetHMSM(new Date());
            if (scope.setmodel.value != null && scope.setmodel.value != '') {
                date = scope.setmodel.resetHMSM(new Date(scope.setmodel.value));
            }
            scope.setmodel.refreshDateList(scope.setmodel, date);
            scope.setmodel.setDisabledDates(scope.setmodel);
            scope.setmodel.selctedDateEpoch = date.getTime();
            scope.setmodel.selectValue = scope.setmodel.convertDateString(scope.setmodel.selctedDateEpoch);
        };

        factory.returnOk = function (scope) {
            if (scope.setmodel.isWorking)
                return;
            if (scope.setmodel.selectValue != null || scope.setmodel.selectValue != '') {
                scope.setmodel.value = scope.setmodel.selectValue;
                scope.setmodel.display = scope.setmodel.getDisplay();
            }
            $timeout(function () {
                scope.setmodel.settemplatesModel && scope.setmodel.settemplatesModel.hide();
            }, 50)
        };

        factory.getValue = function (scope, name) {
            return;
        };

        return factory;
    }]);