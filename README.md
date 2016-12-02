# ionic-setpicker 集合编辑器
引用一种控件，支持多种编辑器。 编辑器在陆续增加中

引入文件 在index.html文件中引入 ionic-setpicker.min.js
<script src="lib/ionic-setpicker.min.js"></script>

在app.js里写入依赖
angular.module('myApp', ['ionic-setpicker'])

城市选择
<ionic-set-picker set-model='cityPickData' set-type="city"></ionic-set-picker>
单项选择
<ionic-set-picker set-model='agePickData' set-type="single"></ionic-set-picker>

app.controller('setCtrl', function($scope) {

    $scope.cityPickData = {
    
        title: '所在地区'
        
    };
    
    $scope.agePickData = {
    
        title: '年龄段',
        
        Service: ['70后', '80后', '90后', '00后', '其他']
        
    };
    
})


