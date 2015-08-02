<div id="right">
    <div id="rightBlockContent">
        <div class='rightBlock'>
            <div class="rightBlockHeader">PDA</div>
            <div class="rightBlockContent">
                <div class="rightBlockContentOpacity"></div>
                <div class="rightContent">
                    <div id="pda">
                        <div id="display">
                            <div id="info">
                                <div id="date">Loading...</div>
                                <div id="time">Loading...</div>
                            </div>
                            <? if(!isset($_SESSION['email'])) { ?>
                            <form action="testreg.php" name="pda" method="post" id="loginForm">
                                <input type="text" name="email" id="login" value="E-Mail">
                                <input type="text" name="password" id="pass" value="Пароль">
                                <p id="forgottenPass">Забыли пароль?</p>
                                <div id="buttons">
                                    <input type="submit" name="submit" value="Вход">
                                    <!--<div id="regButton" onclick="window.location='reg.php'"></div>-->
                                    <input type="button" name="reg" value="Регистрация" onClick="window.location='reg.php'">
                                </div>
                            </form>
                            <? } else { ?>
                            <div id='infoUser'>
                                <div id='topInfo'>
                                    <div id='avatar'>
                                        <a href="page.php"><img src='avatars/<? echo $user->avatar; ?>' width='75px' height='75px'></a>
                                    </div>
                                    <div id='userLogin'><a href="page.php"><? echo $user->login ?></a></div>
                                </div>
                                <div id='bottomInfo'>
                                    <p>Имя: <strong><? echo $user->name.' '.$user->fam; ?></strong></p>
                                    <p>Группа: <strong><? echo $user->access; ?></strong></p>
                                    <p>E-Mail: <strong><? echo $user->email; ?></strong></p>
                                    <p>Ваш ip: <strong><? echo $_SERVER['REMOTE_ADDR']; ?></strong></p>
                                    <p>Вы пользователь №<strong><? echo $user->id; ?></strong></p>
                                    <p>Личных сообщений: <strong>0</strong></p>
                                </div>
                            </div>
                            <div id='pdaSsyl'>
                                <?
									// Количество заявок в друзья в блоке PDA следует выводить, только если пользователь находится за пределами страниц с личной информацией. Все страницы, не включая личных - индексируются, и для них определен отдельный класс Page. $page на всех личных страницах имеет тип string, а на индексируемых - object и является экземпляром класса Page.
                                    if ($page instanceof Page) {
                                        $friends = new Friends($user->id,$db);
                                        $requestsCount = count($friends->getFriendsRequests());
                                    }
                                ?>
                                <a href='page.php'>Моя страница<? if($requestsCount > 0 && $page instanceof Page) echo " (+".$requestsCount.")";?></a>                                     
                                <a href='exit.php'>Выход</a>                                            
                            </div>
                            <? } ?>
                        </div>
                    </div>
                </div>
                <div class="rightBlockFooter"></div>
            </div>
        </div>
        <div class='rightBlock'>
            <div class="rightBlockHeader">Мини-чат</div>
            <div class="rightBlockContent">
                <div class="rightBlockContentOpacity"></div>
                <div class="rightContent">
                    <div id="chat">
                        <div id="messages">
                            <div class="content">
                                <div id="atom">
                                    <div id="core"></div>
                                    <div id="orbit1">
                                        <div id="proton1"></div>
                                    </div>
                                    <div id="orbit2">
                                        <div id="proton2"></div>
                                    </div>
                                    <div id="orbit3">
                                        <div id="proton3"></div>
                                    </div>
								</div>
                                <script>
									var core = document.getElementById("core");
									var deg = Math.floor(Math.random() * 361);
									core.style.background = "radial-gradient(hsl(" + deg + ", 100%, 100%) 0%, hsl(" + deg++ + ", 100%, 50%) 50%, hsl(" + deg++ + ", 100%, 0%) 100%)";
								</script>
                            </div>
                        </div>
                        <div id="chatForm">
                            <form name="chat" onsubmit="return false;">
                                <? if(!isset($_SESSION['email'])) {
										$placeholder = "Для отправки сообщения в чат войдите или зарегистрируйтесь";
										$disable = "disabled";
									} else {
										$placeholder = "Введите текст сообщения";
										$disable = '';
									}
								?>
                                <textarea id="textMessage" placeholder="<? echo $placeholder; ?>" <? echo $disable; ?>></textarea>
                                <? if(isset($_SESSION['email'])) { ?>
                                <input type="submit" name="submit" onclick="addMessage()" value="Отправить">
                                <? } ?>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="rightBlockFooter"></div>
            </div>
        </div>
    </div>
    <div id="rightLine"></div>
</div>