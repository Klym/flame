<?php
session_start();
require("check.php");
?>
<!doctype html>
<html ng-app="adminApp">
<head>
<meta charset="utf-8">
<link rel="import" href="import.html">
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link rel="stylesheet" type="text/css" href="Bootstrap/styles/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<flame-import></flame-import>
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