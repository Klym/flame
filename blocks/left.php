<div id="left">
    <div id="leftBorder"></div>
    <div id="leftBlockContent">
    	<div class='leftBlock'>
            <div class="leftBlockHeader">Последние заметки</div>
            <div class="leftBlockContent">
            	<div class="leftBlockContentOpacity"></div>
           		<div class="leftContent">
                	<?php
					$lastItem = new Item();
					$lastItem->db = $db;
					try {
						$lastItems = $lastItem->getLastItems();
						$lcount = count($lastItems);
					} catch ( DataException $e ) {
						die(require("blocks/errorTemplate.php"));
					}
					switch($lcount) {
						case 0:
							echo "<p>Заметок в базе не обнаружено.</p>";
						break;
						default:
							$lastItem->printLastItems($lastItems);
						break;
					}
					?>
            	</div>
            	<div class="leftBlockFooter"></div>
    		</div>
    	</div>
        <div class='leftBlock'>
            <div class="leftBlockHeader">Поиск</div>
            <div class="leftBlockContent">
            	<div class="leftBlockContentOpacity"></div>
           		<div class="leftContent">
					<form action="search.php" method="get" name="searchForm" style="margin-top:5px;" onSubmit="return searchSubmit(this);">
                    	<input type="text" name="keywords" class="formInput" placeholder="Что ищем?">
                        <input name="search" type="submit" value="Искать">
                    </form>
            	</div>
            	<div class="leftBlockFooter"></div>
    		</div>
    	</div>
        <div class='leftBlock'>
            <div class="leftBlockHeader">Статистика посещений</div>
            <div class="leftBlockContent">
            	<div class="leftBlockContentOpacity"></div>
           		<div class="leftContent">
                	<p>Сейчас онлайн:</p>
                    	<div id="visited">
						<?
							$online = new Online($user->id,session_id(),$db);
							if (isset($_SESSION['email'])) {
								$online->setArr();
								$online->set();
							}
							$online->loginsOnline();
							$online->get();
						?>
                    	</div>
					<p>Нас сегодня посетили:</p>
                    	<div id="visited">
						<?
							$visited = new Visited($user->id,null,$db);
							if (isset($_SESSION['email'])) {
								$visited->setArr();
								$visited->set();
							}
							$visited->get();
							$visited->del();
						?>
                        </div>
            	</div>
            	<div class="leftBlockFooter"></div>
    		</div>
    	</div>
        <div class='leftBlock'>
            <div class="leftBlockHeader">Баннер</div>
            <div class="leftBlockContent">
            	<div class="leftBlockContentOpacity"></div>
           		<div class="leftContent">
                	<div id="banner">
						<a href="http://clan-flame.ru" target="_blank"><img src="../img/banner.gif" alt="Баннер"></a>
                        <input type="button" value="Получить код" onclick="showCode();">
                    </div>
            	</div>
            	<div class="leftBlockFooter"></div>
    		</div>
    	</div>
    </div>
    <div id="leftLine"></div>
</div>