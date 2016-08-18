<?php
session_start();
if (isset($_SESSION["login"])) {
	header("Location: index.php");
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="Bootstrap/styles/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<script src="Bootstrap/js/jquery-1.11.1.min.js"></script>
<script src="Bootstrap/js/bootstrap.min.js"></script>
<title>Админ Панель - Авторизация</title>
</head>
<body>
	<div id="authorizeForm">
    	<div id="authorizeTitle" style="font-size:20px;">Вход в Админ Панель</div>
        <form action="testreg.php" method="post" name="authorizeForm" class="form-inline">
        	<div class="input-group">
				<span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                <input name="login" role="login" type="text" id="authorizeInput" class="form-control" placeholder="Логин" required>
			</div>
            <div class="input-group">
                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                <input name="password" role="password" type="password" id="authorizeInput" class="form-control" placeholder="Пароль" required>
            </div>
            <input type="submit" class="btn btn-success" value="Вход">
        </form>
    </div>
</body>
</html>