<div id="navigation">
	<p><a href="catalog.php">Каталог</a> \ <? echo "<a href='catalog.php?cat=".$item->cat."'>".$item->catTitle."</a>"; ?> \ <? echo $page->title; ?></p>
</div>
<div class='news'>
	<div class='newsTitleImg'><span><? echo $item->title; ?></span></div>
	<div class='newsContent'><? echo $item->text; ?></div>
	<div class='newsFooter'></div>
	<div class='newsFooterContent'>Добавил: <a href='page.php?id=<? echo $item->authorId; ?>'><? echo $item->authorLogin; ?></a> | Дата: <? echo $item->date; ?> | Просмотров: <? echo $item->view; ?> | Комментариев: <span id="commentsCount"><? echo $item->commentsCount; ?></span></div></div>
<div id='comments'>
<?php
$item->getComments();
Comment::printComments();
?>
</div>
<form method="POST">
	<div id="commentForm">
    	<? if(!isset($_SESSION['email'])) {
				$placeholder = "Для отправки комментария войдите или зарегистрируйтесь";
				$disable = "disabled";
			} else {
				$placeholder = "Введите текст сообщения";
				$disable = '';
			}
		?>
        <textarea name="text" id="commentArea" placeholder="<? echo $placeholder; ?>" <? echo $disable; ?>></textarea><br>
	    <input type="hidden" name="type" value="<? echo $item::TYPE; ?>">
        <? if(isset($_SESSION['email'])) { ?>
        <input id="sendButton" type="submit" name="submit" value="Отправить">
        <? } ?>
	</div>
</form>