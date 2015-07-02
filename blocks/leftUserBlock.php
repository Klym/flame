<?php
if (!isset($id)) {
	$id = "";
}
if ($user1->pol == 2) {
	$ending1 = "а";
	$ending2 = "ё";
}
else {
	$ending1 = null;
	$ending2 = "го";
}
if ($page != "friends") {// Блок кода приведенный ниже подключается на странице friends.php, и здесь исключается возможность переопределения.
	$self = new Friends($user->id,$db);
	$selfFriendsIds = $self->getConfirmedFriends();
	$selfNotConfFriends = $self->getNotConfirmedFriends();
	$selfFriendsRequests = $self->getFriendsRequests();
	$requestsCount = count($selfFriendsRequests);
}
?>
<div class="leftUserBlock">
	<div class="userAvatar">
    	<img src="avatars/<? echo $user1->avatar; ?>" width="150px" height="150px">
	</div>
    <div class="userFunctions">
    	<ul>
			<? if ($id == $user->id || empty($id)) {?>
        		<li <? if($page == "im") echo "class='active'"; ?>><a href="im.php">Личные сообщения</a></li>
            <? } else {?>
            	<li><a href="im.php">Отправить сообщение</a></li>
			<? } ?>
            <li <? if($page == "user" && ($id == $user->id || empty($id))) echo "class='active'"; ?>><a href="page.php">Моя страница</a></li>
            <li <? if($page == "edit") echo "class='active'"; ?>><a href="edit.php">Редактировать</a></li>
            <li <? if($page == "friends") echo "class='active'"; ?>><a href="friends.php<? if ($id != $user->id && !empty($id)) echo "?id=".$id; ?>">Друзья<? if(($id == $user->id || empty($id)) && $requestsCount > 0 && $page != "friends") echo " (+".$requestsCount.")";?></a></li>
            <? if ($id != $user->id && !empty($id)) {?>
            	<li><? if (!($self->isFriend($id,$selfFriendsIds)) && !($self->isFriend($id,$selfNotConfFriends)) && !($self->isFriend($id,$selfFriendsRequests))) { ?><a href="#" class="addFriend" name="<? echo $id; ?>">Добавить в друзья</a><? } else if ($self->isFriend($id,$selfFriendsRequests)) {echo "<a href='#' class='addFriend' name='$id'>Принять заявку в дурьзя</a>";} else if($self->isFriend($id,$selfNotConfFriends)) {echo "<span class='notConfirm'>".$user1->login." не подтвердил".$ending1.", что вы е".$ending2." друг</span>";} else {echo "<a class='delFriend' href='#' name='$id'>Убрать из друзей</a>";} ?></li>
			<? } ?>
		</ul>
	</div>
</div>