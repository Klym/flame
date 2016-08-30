<?php
session_start();
require("check.php");
?>
<!doctype html>
<html ng-app="adminApp">
<head>
<meta charset="utf-8">
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link rel="stylesheet" type="text/css" href="Bootstrap/styles/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<script src="Bootstrap/js/jquery-1.11.1.min.js"></script>
<script src="Bootstrap/js/bootstrap.min.js"></script>
<script src="js/vendor/angular.min.js"></script>
<script src="js/vendor/angular_resource.js"></script>
<script src="js/vendor/angular_route.js"></script>
<script src="js/vendor/md5.js"></script>

<script src="js/app.js"></script>
<script src="js/controllers/route.js"></script>
<script src="js/controllers/nav.js"></script>
<script src="js/controllers/page.js"></script>
<script src="js/controllers/user.js"></script>
<script src="js/controllers/userGroup.js"></script>
<script src="js/controllers/category.js"></script>
<script src="js/controllers/data.js"></script>
<script src="js/controllers/news.js"></script>
<script src="js/controllers/sostav.js"></script>
<script src="js/controllers/rang.js"></script>
<script src="js/controllers/pagination.js"></script>

<script src="js/services/message.js"></script>
<script src="js/services/searchObj.js"></script>
<script src="js/services/changeSort.js"></script>

<script src="js/directives/defineUserGroup.js"></script>
<script src="js/directives/defineCat.js"></script>
<script src="js/directives/defineNewsType.js"></script>
<script src="js/directives/definePlayerRang.js"></script>

<script src="js/filtres/getPaginationPages.js"></script>
<script>
	var href = document.location.href.split("/");
	var base = href[2];
	var baseEl = document.createElement("base");
	baseEl.setAttribute("href", "http://" + base + "/admin/");
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(baseEl);
</script>
<title>Flame Admin</title>
</head>
<body>
<div ng-if="showLoader" id="block"></div>
<ng-include src="'views/navbar.html'"></ng-include>
<div class="content">
    <div class="row">
        <div class="col-md-3">
            <ng-include src="'views/nav.html'" ng-controller="navCtrl"></ng-include>  
        </div>
        <div class="col-md-9">
            <div ng-view ng-controller="routeCtrl"></div>
        </div>
    </div>
</div>
<footer class="well well-sm pull-right">Powered by Klym | admin.clan-flame.ru © 2014-<?=date("Y");?></footer>
</body>
</html>